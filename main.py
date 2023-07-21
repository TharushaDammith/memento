import os

from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, login_user, login_required, UserMixin, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from send_mail import SendMail
from sqlalchemy.exc import IntegrityError
from string import ascii_lowercase
from unsplash import Unsplash
from werkzeug.security import generate_password_hash, check_password_hash
import json
import random


def generate_verification_key(user):
    key_len = random.choice([n for n in range(10, 20)])
    key = ""
    for i in range(key_len):
        key += random.choice(ascii_lowercase)

    new_verification = VerifyEmail(
        user=user,
        key=key
    )

    db.session.add(new_verification)
    db.session.commit()


def shape_data(list_1d: list):
    list_2d, row = [], []
    num = 0
    for i in list_1d:
        num += 1
        row.append(i)
        if num == 5:
            list_2d.append(row)
            num, row = 0, []

    return list_2d


app = Flask(__name__)
db = SQLAlchemy()
app.config["SECRET_KEY"] = "ErjtrKRJEewewLke"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL") # put psycopg2 to url start
db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)


class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    email = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    verification = db.relationship("VerifyEmail", back_populates="user")
    post = db.relationship("Post", back_populates="user")
    settings = db.relationship("Settings", back_populates="user")


class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    theme = db.Column(db.String(100), default="Light", nullable=False)
    bottom_lim = db.Column(db.Integer, default=3, nullable=False)
    top_lim = db.Column(db.Integer, default=7, nullable=False)
    user = db.relationship("User", back_populates="settings")


class VerifyEmail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    status = db.Column(db.Boolean, default=False, nullable=False)
    key = db.Column(db.String, nullable=False)
    user = db.relationship("User", back_populates="verification")


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship("User", back_populates="post")
    image = db.Column(db.String(500), nullable=True)
    text = db.Column(db.String(500), nullable=False)
    check = db.Column(db.String(100), nullable=False)
    expiry_date = db.Column(db.Integer, nullable=False)


with app.app_context():
    db.create_all()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@app.route('/')
def home():
    return render_template("index.html")


@app.route("/about")
def about():
    if current_user.is_authenticated:
        data = Settings.query.get(current_user.id)
        theme = data.theme
    else:
        theme = None
    return render_template("about.html",
                           theme=theme)


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = User.query.filter_by(email=email).first()
        if user:
            password_is_correct = check_password_hash(
                pwhash=user.password,
                password=password
            )
            if password_is_correct:
                login_user(user)
                return redirect(url_for("dashboard"))
            else:
                flash("")
                flash("Incorrect password")
        else:
            flash("Email doesn't exist")
            flash("")

    return render_template("login.html")


@app.route("/sign-up", methods=["GET", "POST"])
def sign_up():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]

        new_user = User(
            name=name,
            email=email,
            password=generate_password_hash(
                password=password,
                salt_length=8
            )
        )

        try:
            db.session.add(new_user)
            db.session.commit()
        except IntegrityError:
            flash("This email already exists.")
            return redirect(url_for("sign_up"))

        new_settings = Settings(
            user=new_user
        )
        db.session.add(new_settings)
        db.session.commit()

        generate_verification_key(new_user)

        verify = VerifyEmail.query.filter_by(user_id=new_user.id).first()
        link = f"{request.url_root}verify_email?id={verify.id}&key={verify.key}"
        send_mail = SendMail(link, new_user.email, new_user.name)
        send_mail.send_msg()

        login_user(new_user)

        return redirect(url_for("dashboard"))

    return render_template("sign-up.html")


@app.route("/verify_email")
def verify_email():
    user_id = request.args["id"]
    key = request.args["key"]

    verify = VerifyEmail.query.get(user_id)
    if verify:
        if verify.key == key:
            verify.status = True
            db.session.commit()

            return redirect(url_for('dashboard'))
        else:
            return "Invalid key"

    return redirect(url_for("sign_up"))


@app.route("/dashboard", methods=["POST", "GET"])
def dashboard():
    if request.method == "POST":
        data = request.form["data"].split(']')
        img = data[1].split('~')
        txt = data[0].split('~')
        chk = data[2].split('~')
        dte = data[3].split('~')

        Post.query.delete()

        for i in range(len(txt)):
            new_post = Post(
                user=current_user,
                image=img[i],
                text=txt[i],
                check=chk[i],
                expiry_date=dte[i]
            )

            db.session.add(new_post)
            db.session.commit()

    try:
        note_id = request.args["note_id"]
        img_link = request.args["img_link"]
    except KeyError:
        note_id, img_link = None, None

    posts, theme = "no_posts", None
    if current_user.is_authenticated:
        posts = Post.query.filter_by(user_id=current_user.id).all()
        if not posts:
            posts = "no_posts"

        data = Settings.query.get(current_user.id)
        theme = data.theme
    return render_template("dashboard.html",
                           posts=posts,
                           note_id=note_id,
                           img_link=img_link,
                           theme=theme)


@app.route("/settings", methods=["GET", "POST"])
@login_required
def settings():
    if request.method == "POST":
        if "save" in request.form:
            min_lim = request.form["min-lim"]
            max_lim = request.form["max-lim"]
            theme = request.form["theme"]

            new_settings = Settings.query.get(current_user.id)

            new_settings.top_lim = max_lim
            new_settings.bottom_lim = min_lim
            new_settings.theme = theme

            db.session.commit()

            name = request.form["name"]
            email = request.form["email"]
            password = request.form["password"]
            new_password = request.form["new-password"]

            if password != "":
                password_is_correct = check_password_hash(
                    pwhash=current_user.password,
                    password=password
                )
                if password_is_correct:
                    current_user.password = generate_password_hash(
                        password=new_password,
                        salt_length=8
                    )
                    db.session.commit()
                else:
                    flash("*Incorrect password")
            elif new_password != "":
                flash("*Incorrect password")

            if name != current_user.name:
                current_user.name = name
                db.session.commit()

            if email != current_user.email:
                current_user.email = email
                db.session.commit()

                verify = VerifyEmail.query.filter_by(user_id=current_user.id).first()
                db.session.delete(verify)
                generate_verification_key(current_user)

                verify = VerifyEmail.query.filter_by(user_id=current_user.id).first()
                link = f"{request.url_root}verify_email?id={verify.id}&key={verify.key}"
                send_mail = SendMail(link, current_user.email, current_user.name)
                send_mail.send_msg()
        else:
            post = Post.query.filter_by(user_id=current_user.id).all()
            email_verification = VerifyEmail.query.filter_by(user_id=current_user.id).first()
            user_settings = Settings.query.filter_by(user_id=current_user.id).first()
            if post:
                for i in post:
                    db.session.delete(i)
            db.session.delete(email_verification)
            db.session.delete(user_settings)
            db.session.delete(current_user)
            db.session.commit()
            return redirect(url_for('sign_up'))

    name = current_user.name
    email = current_user.email

    data = Settings.query.get(current_user.id)
    default_limits = [data.bottom_lim, data.top_lim]
    verify = VerifyEmail.query.filter_by(user_id=current_user.id).first()

    return render_template("settings.html",
                           name=name,
                           email=email,
                           def_val=default_limits,
                           verify=verify.status,
                           theme=data.theme)


@app.route("/select-image", methods=["POST", "GET"])
@login_required
def select_image():
    unsplash = Unsplash()
    if request.method == "POST":
        if "form1" in request.form:
            query = request.form["search"]
            data = shape_data(unsplash.search_image(query))

            user_settings = Settings.query.get(current_user.id)

            return render_template("images.html", image_links=data,
                                   populate_search=query,
                                   id=request.args["note_id"],
                                   theme=user_settings.theme)
        elif "form2" in request.form:
            query = request.form["load-more"]
            item_limit = request.form["item-limit"]
            data = shape_data(unsplash.search_image(query, item_limit=item_limit))
            user_settings = Settings.query.get(current_user.id)

            return render_template("images.html",
                                   image_links=data,
                                   populate_search=query,
                                   id=request.args["note_id"],
                                   theme=user_settings.theme)
        else:
            user_settings = Settings.query.get(current_user.id)

            return redirect(url_for('dashboard',
                                    note_id=request.form["note-id"],
                                    img_link=request.form["img-link"],
                                    theme=user_settings.theme)
                            )

    with open("init_links.txt") as file:
        data = [line.replace('\n', '') for line in file.readlines()]

    data = shape_data(data)

    user_settings = Settings.query.get(current_user.id)

    return render_template("images.html",
                           image_links=data,
                           populate_search="",
                           id=request.args["note_id"],
                           theme=user_settings.theme)


@app.route("/calender")
@login_required
def calender():
    data = Settings.query.get(current_user.id)
    post_list = Post.query.filter_by(user_id=current_user.id).all()
    user_settings = Settings.query.filter_by(user_id=current_user.id).first()
    tasks = {}

    for post in post_list:
        posts_on_date = Post.query.filter_by(expiry_date=post.expiry_date).all()
        posts_on_date = [not_checked for not_checked in posts_on_date if not_checked.check != "http://127.0.0.1:5000" \
                                                                                              "/static/icons/correct-clicked.png"]
        if post.check == "http://127.0.0.1:5000/static/icons/correct-clicked.png":
            continue
        tasks[f"{post.expiry_date}"] = [f"{p.text[:25]}..." for p in posts_on_date]

    return render_template("calender.html",
                           theme=data.theme,
                           tasks=tasks,
                           lim=f"{user_settings.bottom_lim};{user_settings.top_lim}")


@app.route("/log_out")
def log_out():
    logout_user()
    return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(debug=True)
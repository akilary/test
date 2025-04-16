from flask import Blueprint, render_template, redirect, url_for, flash, jsonify, request
from flask_login import login_required, current_user

from ..forms import ContactForm
from ..utils import get_filtered_paginated_products, get_categories, get_product, add_to_wishlist, remove_from_wishlist

shop_bp = Blueprint("shop", __name__, url_prefix="/")


@shop_bp.route("/")
@shop_bp.route("/home")
def home():
    return render_template("home.html")


@shop_bp.route("/catalog")
def catalog():
    return render_template("catalog.html", categories=get_categories())


@shop_bp.route("/about")
def about():
    return render_template("about.html")


@shop_bp.route("/contacts", methods=["GET", "POST"])
def contacts():
    form = ContactForm()
    if form.validate_on_submit():
        flash("Ваше сообщение успешно отправлено!", "success")
        return redirect(url_for("shop.contacts"))
    return render_template("contact.html", form=form)


@shop_bp.route("/team")
def team():
    return render_template("team.html")


@shop_bp.route('/api/products', methods=["GET"])
def get_products():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 20, type=int)
        price_min = request.args.get("price_min", type=int)
        price_max = request.args.get("price_max", type=int)
        categories = request.args.getlist("categories")
        sort = request.args.get("sort")

        results = get_filtered_paginated_products(
            page=page,
            per_page=per_page,
            price_min=price_min,
            price_max=price_max,
            categories=categories,
            sort=sort,
            user_id=current_user.id if current_user.is_authenticated else None,
        )
        rendered_html = "".join([
            render_template('product_card.html', product=product)
            for product in results["data"]
        ])

        return jsonify({
            "html": rendered_html,
            "page": results["page"],
            "total_pages": results["total_pages"],
            "total_items": results["total_items"],
        })
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@shop_bp.route("/api/wishlist/<int:product_id>", methods=["PUT"])
@login_required
def add_product_to_wishlist(product_id: int):
    try:
        add_to_wishlist(current_user.id, product_id)
        return jsonify({"message": "Товар добавлен в избранное"}), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": f"Ошибка сервера: {e}"}), 500


@shop_bp.route("/api/wishlist/<int:product_id>", methods=["DELETE"])
@login_required
def remove_product_from_wishlist(product_id: int):
    try:
        remove_from_wishlist(current_user.id, product_id)
        return jsonify({"message": "Товар удалён из избранного"}), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": f"Ошибка сервера: {e}"}), 500


@shop_bp.route("product/<int:product_id>", methods=["GET", "POST"])
def product_details(product_id: int):
    try:
        product = get_product(product_id)
        return render_template("product_detail.html", product=product)
    except ValueError as e:
        flash(str(e), "danger")
        return redirect("home")

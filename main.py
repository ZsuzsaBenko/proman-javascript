from flask import Flask, render_template, jsonify, request, session
import data_manager

app = Flask(__name__)
app.secret_key = "ff7F67BNtKkmGTseVkIjnTboXyN6k5/6IesaIrNsQUSfFAMm7NUYPYx6nzc7+W7GC9SYeMJjnxWR9ko2lRNYriBkyK91nPyaCW9wUuOQzh05N2G74xKvQ9gQne+M9Os6qdZ/3OmstZ+gs6TD01dcsIcVmj2PCYHwAGI7VNe3We4="


@app.route("/")
def route_index():
    if "username" in session:
        return render_template('boards.html', logged_in=True)
    else:
        return render_template('boards.html', logged_in=False)


@app.route("/boards", methods=['GET'])
def get_boards():
    if "username" in session:
        boards = data_manager.get_private_boards(session["username"])
    else:
        boards = data_manager.get_public_boards()
    return jsonify(boards)


@app.route("/boards", methods=['POST'])
def save_board():
    data = request.get_json()
    if "user_id" in session:
        data["user_id"] = session["user_id"]
        data_manager.add_new_board(data)
        return "", 200
    else:
        return "", 403


@app.route('/boards', methods=["PUT"])
def update_board_title():
    data = request.get_json()
    user_id = data_manager.get_user_id_for_board(data["id"])
    if "user_id" in session and user_id == session["user_id"]:
        data_manager.update_board_title(data)
        return "", 200
    else:
        return "", 403


@app.route('/boards', methods=["DELETE"])
def delete_board():
    data = request.get_json()
    user_id = data_manager.get_user_id_for_board(data["board_id"])
    if "user_id" in session and user_id == session["user_id"]:
        data_manager.delete_board(data)
        return "", 200
    else:
        return "", 403


@app.route("/cards", methods=["POST"])
def save_card():
    data = request.get_json()
    user_id = data_manager.get_user_id_for_board(data["board_id"])
    if "user_id" in session and user_id == session["user_id"]:
        data_manager.add_new_card(data)
        return "", 200
    else:
        return "", 403


@app.route('/cards', methods=["PUT"])
def update_card_title():
    data = request.get_json()
    user_id = data_manager.get_user_id_from_card_id(data["id"])
    if "user_id" in session and user_id == session["user_id"]:
        data_manager.update_card_title(data)
        return "", 200
    else:
        return "", 403


@app.route("/cards", methods=["DELETE"])
def delete_card():
    data = request.get_json()
    user_id = data_manager.get_user_id_from_card_id(data["card_id"])
    if "user_id" in session and user_id == session["user_id"]:
        data_manager.delete_card(data)
        return "", 200
    else:
        return "", 403


@app.route('/statuses', methods=["PUT"])
def update_statuses():
    data = request.get_json()
    user_id = data_manager.get_user_id_for_board(data["id"])
    if "user_id" in session and user_id == session["user_id"]:
        data_manager.update_statuses(data)
        return "", 200
    else:
        return "", 403


@app.route('/card-order-update', methods=["PUT"])
def update_card_order():
    data = request.get_json()
    user_id = data_manager.get_user_id_from_card_id(data["cardId"])
    if "user_id" in session and user_id == session["user_id"]:
        data_manager.update_card_order(data)
        return "", 200
    else:
        return "", 403


@app.route('/registration', methods=['POST'])
def register():
    data = request.get_json()
    if data_manager.register_user(data):
        return jsonify(error="")
    else:
        return jsonify(error="error")


@app.route('/login', methods=['POST'])
def login():
    user_data = request.get_json()
    if data_manager.check_login(user_data):
        session['username'] = user_data['username']
        user_id = data_manager.get_user_id(user_data['username'])
        session['user_id'] = user_id
        return jsonify(state="loggedIn")
    else:
        return jsonify(error="error")


@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop("user_id", None)
    return "", 200


def main():
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    )


if __name__ == '__main__':
    main()

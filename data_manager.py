from connection import connection_handler
import bcrypt


@connection_handler
def get_public_boards(cursor):
    cursor.execute("""
                    SELECT boards.*, users.username FROM boards 
                    JOIN users ON boards.user_id = users.id
                    WHERE type = FALSE
                    ORDER BY boards.id;
                    """)
    boards = cursor.fetchall()
    format_boards_with_cards(boards)
    return boards


@connection_handler
def get_private_boards(cursor, username):
    cursor.execute("""
                    SELECT boards.*, users.username FROM boards
                    JOIN users ON boards.user_id = users.id
                    WHERE username = %(username)s
                    ORDER BY boards.id;
                    """, {"username": username})
    boards = cursor.fetchall()
    format_boards_with_cards(boards)
    return boards


@connection_handler
def get_cards(cursor, board_id):
    cursor.execute("""
                    SELECT * FROM cards
                    WHERE board_id = %(board_id)s
                    ORDER BY order_num ASC;
                    """,
                   {"board_id": board_id})
    cards = cursor.fetchall()
    return cards


@connection_handler
def add_new_board(cursor, data):
    cursor.execute("""
                    INSERT INTO boards(title, statuses, user_id, type)
                    VALUES (%(title)s, %(statuses)s, %(user_id)s, %(type)s);
                    """, data)


@connection_handler
def add_new_card(cursor, data):
    cursor.execute("""
                    INSERT INTO cards (title, board_id, status_id, order_num)
                    VALUES (%(title)s, %(board_id)s, %(status_id)s, %(order_num)s);
                    """, data)


@connection_handler
def delete_card(cursor, data):
    cursor.execute("""
                    DELETE FROM cards
                    WHERE id = %(card_id)s;
                   """, data)


@connection_handler
def update_board_title(cursor, data):
    cursor.execute("""
                    UPDATE boards
                    SET title = %(new_title)s WHERE id = %(id)s;
                    """, data)


@connection_handler
def update_card_title(cursor, data):
    cursor.execute("""
                    UPDATE cards
                    SET title = %(new_title)s WHERE id = %(id)s;
                    """, data)


@connection_handler
def update_statuses(cursor, data):
    cursor.execute("""
                    UPDATE boards
                    SET statuses = %(statuses)s WHERE id = %(id)s
                    """, data)


@connection_handler
def delete_board(cursor, data):
    cursor.execute("""
                        DELETE FROM cards
                        WHERE board_id = %(board_id)s;
                        """, data)
    cursor.execute("""
                    DELETE FROM boards
                    WHERE id = %(board_id)s;
                    """, data)


@connection_handler
def update_card_order(cursor, data):
    cursor.execute("""
                    UPDATE cards
                    SET status_id = %(status)s, order_num = %(order)s
                    WHERE id = %(cardId)s;
                    """, data)


@connection_handler
def register_user(cursor, data):
    data["password"] = hash_password(data["password"])
    try:
        cursor.execute("""
                        INSERT INTO users (username, password)
                        VALUES (%(username)s, %(password)s);
                        """, data)
        return True
    except:
        return False


@connection_handler
def get_password_for_user(cursor, username):
    cursor.execute("""
                    SELECT password FROM users
                    WHERE username = %(username)s
                    """, {'username': username})
    password = cursor.fetchone()
    return password


def check_login(data):
    hashed_password = get_password_for_user(data['username'])
    try:
        return verify_password(data['password'], hashed_password['password'])
    except TypeError:
        return False


def format_boards_with_cards(boards):
    for board in boards:
        board["cards"] = get_cards(board["id"])
        board["statuses"] = board["statuses"].split(",")


def hash_password(plain_text_password):
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


@connection_handler
def get_user_id(cursor, username):
    cursor.execute("""
        SELECT id FROM users
        WHERE username=%(username)s;
        """, {'username': username})
    user_id = cursor.fetchone()
    return user_id['id']


@connection_handler
def get_user_id_for_board(cursor, board_id):
    cursor.execute("""
        SELECT user_id FROM boards
        WHERE id = %(board_id)s;
    """, {"board_id": board_id})
    user_id = cursor.fetchone()
    return user_id['user_id']


@connection_handler
def get_user_id_from_card_id(cursor, card_id):
    cursor.execute("""
        SELECT boards.user_id FROM boards
        JOIN cards ON boards.id = cards.board_id
        WHERE cards.id = %(card_id)s;
    """, {"card_id": card_id})
    user_id = cursor.fetchone()
    return user_id['user_id']

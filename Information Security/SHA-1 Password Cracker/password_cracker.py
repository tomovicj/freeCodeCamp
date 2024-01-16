import hashlib


def crack_sha1_hash(hash, use_salts=False):
    with open("top-10000-passwords.txt", "r") as passwords:
        for password in passwords:
            password = password.strip("\n")
            if use_salts:
                with open("known-salts.txt", "r") as salts:
                    for salt in salts:
                        salt = salt.strip("\n")
                        if compare(salt + password, hash) or compare(password + salt, hash):
                            return password
            else:
                if compare(password, hash):
                    return password
    return "PASSWORD NOT IN DATABASE"


def compare(password, hash):
    if hashlib.sha1(password.encode()).hexdigest() == hash:
        return True
    else:
        return False

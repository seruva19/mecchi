import uuid

sessions = {}


def get_session(session_id):
    session = sessions.get(session_id, None)
    if session is None:
        session = MecchiSession()
        sessions[session_id] = session
        print(f"🎧 created new session: {session_id}")

    return session


def delete_session(session_id):
    if session_id in sessions:
        del sessions[session_id]


def clear_sessions(self):
    sessions.clear()


class MecchiSession:
    def __init__(self, session_id=None):
        self.session_id = session_id if session_id else str(uuid.uuid4())
        self.data = {}

        def set_data(self, key, value):
            self.data[key] = value

        def get_data(self, key):
            return self.data.get(key)

        def delete_data(self, key):
            if key in self.data:
                del self.data[key]

        def clear_data(self):
            self.data.clear()

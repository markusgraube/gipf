class Singleton:
    """
    A non-thread-safe helper class to ease implementing singletons.
    This should be used as a decorator -- not a metaclass -- to the
    class that should be a singleton.

    The decorated class can define one `__init__` function that
    takes only the `self` argument. Other than that, there are
    no restrictions that apply to the decorated class.

    To get the singleton instance, just call it.

    Limitations: The decorated class cannot be inherited from.

    Doc: https://rdflib.readthedocs.org/en/latest/apidocs/rdflib.html?highlight=conjunctive#rdflib.graph.DataSet

    """

    def __init__(self, decorated):
        self._decorated = decorated


    def __call__(self):
        try:
            return self._instance
        except AttributeError:
            self._instance = self._decorated()
            return self._instance

    def __instancecheck__(self, inst):
        return isinstance(inst, self._decorated)
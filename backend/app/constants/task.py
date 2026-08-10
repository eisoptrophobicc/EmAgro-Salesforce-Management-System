from enum import Enum


class TaskInputType(str, Enum):
    BOOLEAN = "Boolean"
    INTEGER = "Integer"
    TEXT = "Text"

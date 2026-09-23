"""Builds dashboards from the batch spec files: python3 _build/build.py [batch...]"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from engine import Dash  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def all_specs():
    from batch1 import B1
    specs = list(B1)
    for name in ("batch2", "batch3", "batch4", "batch5", "batch6", "batch7", "batch8", "batch9", "batch10"):
        try:
            mod = __import__(name)
            specs += getattr(mod, "B" + name[5:])
        except ImportError:
            pass
    return specs


if __name__ == "__main__":
    total = 0
    for s in all_specs():
        n = Dash(s).build(os.path.join(ROOT, s["slug"]))
        total += n
        print(f"{s['num']:>3} {s['brand']:<14} {n} pages")
    print("total pages:", total)

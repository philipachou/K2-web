import pytest

@pytest.fixture(scope="session")
def base_url():
    return "http://127.0.0.1:8000"

@pytest.fixture
def page_context(page, base_url):
    page.set_viewport_size({"width": 1194, "height": 834})
    page.goto(base_url)
    page.wait_for_timeout(2000)
    return page

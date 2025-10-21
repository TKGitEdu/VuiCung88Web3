from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Log in
    page.goto("http://localhost:3000/login")
    page.wait_for_load_state("networkidle")
    page.get_by_placeholder("VuiCung88").fill("user")
    page.get_by_placeholder("••••••••").fill("user123")
    page.get_by_role("button", name="Đăng Nhập").click()


    # Wait for navigation to dashboard
    page.wait_for_url("http://localhost:3000/dashboard")

    # Click the user menu to reveal the dropdown
    page.locator('button[aria-label="User menu"]').click()

    # Navigate to Tic-Tac-Toe
    page.get_by_text("Tic-Tac-Toe").click()
    page.wait_for_url("http://localhost:3000/tic-tac-toe")

    # Take screenshot
    page.screenshot(path="jules-scratch/verification/tictactoe.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

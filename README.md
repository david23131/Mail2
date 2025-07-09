# CS50 Web Programming with Python and JavaScript - Email Client

This is a project for the **CS50 Web Programming with Python and JavaScript** course. The goal of the project is to design a front-end for an email client that communicates with a back-end API to send and receive emails.

## Features

- **Inbox**, **Sent**, and **Archived** mailboxes
- **Compose new email** functionality
- **View individual email** content
- **Archive and unarchive emails**
- **Reply to emails**

## Requirements

- Python 3.x
- Django framework
- JavaScript (for front-end functionality)
- HTML and CSS

## Installation

### Clone the repository:

```bash
git clone https://github.com/yourusername/project3.git
cd project3
```
Setup Virtual Environment (Optional but recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Apply migrations:
```bash
python manage.py makemigrations mail
python manage.py migrate
```
Run the Django development server:
```bash
python manage.py runserver
```
Now, open your browser and navigate to http://127.0.0.1:8000/.

## Usage

- **Sign Up**: Use the "Register" link to create an account with a fake email address and password.
- **Send Email**: Use the "Compose" page to send emails to other users.
- **View Emails**: View emails in your **Inbox**, **Sent**, and **Archived** mailboxes.
- **Archive Emails**: Archive/unarchive emails by marking them via the buttons in the mailbox.
- **Reply to Emails**: When viewing an email, you can reply to it, and the form will pre-fill with the recipient’s email and email content.

## API Endpoints

- **GET /emails/<str:mailbox>**: Fetch emails from a specific mailbox (`inbox`, `sent`, `archive`).
- **GET /emails/<int:email_id>**: Fetch a specific email by its ID.
- **POST /emails**: Send a new email. Requires `recipients`, `subject`, and `body`.
- **PUT /emails/<int:email_id>**: Update email status, like marking as read/unread or archiving/unarchiving.

## Project Structure

- `manage.py`: Django project manager
- `project3/`: Main project directory
  - `mail/`: App for the email client
    - `migrations/`: Database migrations
    - `models.py`: Defines the email model
    - `urls.py`: URL routing for the app
    - `views.py`: Defines the views and handling of incoming requests
    - `templates/mail/`: HTML templates for the front-end
    - `static/mail/`: Static files (CSS and JavaScript)
      - `inbox.js`: JavaScript for handling mailbox views and email interactions
      - `styles.css`: CSS styles for the front-end interface

## Contributing

Feel free to fork this repository and submit pull requests. If you want to contribute, ensure you follow the project structure and include tests for your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [CS50's Web Programming](https://cs50.harvard.edu/web/)
- [Django Framework](https://www.djangoproject.com/)
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

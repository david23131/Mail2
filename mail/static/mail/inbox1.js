document.addEventListener('DOMContentLoaded', function() {
  

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector("#compose-form").addEventListener('submit', send_email);
  

  // manage submit button, disabled if recipents/subject/body arent all filled 
  const submit = document.querySelector('#submit');
  submit.disabled = true;

  const recipents = document.querySelector('#compose-recipients');
  const subject = document.querySelector('#compose-subject');
  const body = document.querySelector('#compose-body');

  recipents.onkeyup = () => {
    submit.disabled = check_submit_state();
  }
  subject.onkeyup = () => {
    submit.disabled = check_submit_state();
  }
  body.onkeyup = () => {
    submit.disabled = check_submit_state();
  }

  // By default, load the inbox
  load_mailbox('inbox');
});




function check_submit_state() {
  const recipents = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  if (recipents.length > 0 && subject.length > 0 && body.length > 0) {
    return false;
  } else {
    return true;
  }
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-details').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-details').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#title').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  load(mailbox);
  console.log(mailbox);
}

function archive_email(id) {
  fetch(`/emails/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      archived: true
  })
}).then(response => {
  if (response.ok) {
    load_mailbox('inbox')}
  })
}

function unarchive_email(id) {

  fetch(`/emails/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      archived: false
  })
}).then(response => {
    if (response.ok) {
      load_mailbox('inbox')}
    })


}

function email_details(id, mailbox) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-details').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);

    // display 
    const emails_content = document.querySelector('#email-content');
    emails_content.innerHTML = `<div style="font-family: Arial, sans-serif; padding: 20px;">
    <div style="margin-bottom: 20px;">
        <p style="margin: 0; font-size: 16px;"><strong>From:</strong> ${email.sender}</p>
        <p style="margin: 0; font-size: 16px;"><strong>To:</strong> ${email.recipients}</p>
        <p style="margin: 0; font-size: 16px;"><strong>Subject:</strong> ${email.subject}</p>
        <p style="margin: 0; font-size: 16px;"><strong>Timestamp:</strong> ${email.timestamp}</p>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
        <button id = "reply_button" style="padding: 8px 15px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Reply
        </button>
       
        <button id = "archive_button" style="padding: 8px 15px; display:none; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Archive
        </button>
        <button id = "unarchive_button" style="padding: 8px 15px; display:none; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Unarchive
        </button>
    </div>
    <hr style="border: 0; height: 1px; background-color: #ccc; margin: 20px 0;">
    <div>
        <p style="margin: 0; font-size: 16px;">${email.body}</p>
    </div>
    </div>`
  console.log(`mailbox is :${mailbox}`);
  document.querySelector('#reply_button').addEventListener('click', () => reply_email(id));
  if (mailbox == 'inbox') {
    document.querySelector('#archive_button').style.display = 'block';
    document.querySelector('#archive_button').addEventListener('click',() => archive_email(id));
    
  } else if (mailbox == 'archive') {
    document.querySelector('#unarchive_button').style.display = 'block';
    document.querySelector('#unarchive_button').addEventListener('click', () => unarchive_email(id));
  }  
  });

}


function reply_email(id) {
  // email replied to 
  fetch(`/emails/` + id)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);
    // prefill 
    compose_email();
    
    const recipents = document.querySelector('#compose-recipients');
    recipents.disabled = true;
    recipents.value = email.sender;
    
    const subject = document.querySelector('#compose-subject');
    subject.disabled = true;
    if (email.subject.slice(0, 4) != "Re: ") {
      subject.value = `Re: ${email.subject}`;
    } else {
      subject.value = email.subject;
    }

    const body = document.querySelector('#compose-body');
    body.value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
    

    
});
  
  

}


function load(mailbox) {
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    const emails_container = document.querySelector('#emails');
    emails_container.innerHTML = ""; // clear previous content
    

    // Print emails
    emails.forEach(email => {
      let read = email.read;
      
      let background_color;
      if (read == false) {
        background_color = 'white';
      } else {
        background_color = 'lightgrey';
      }
      const email_div = document.createElement('div');
      email_div.setAttribute('data-id', email.id);
      email_div.innerHTML = `
      <div class = "email-item" data-id= ${email.id} style="display: flex; background-color: ${background_color}; justify-content: space-between; align-items: center; padding: 10px; border: 2px solid #000;">
          <span style="font-weight: bold; flex: 1; text-align: left; max-width: 30%;"> From: ${email.sender}</span>
          <span style="flex: 2; text-align: center; margin: 0 20px; max-width: 40%;">${email.subject}</span>
          <span style="color: #666; font-size: 0.9em; flex: 1; text-align: right; max-width: 30%;">${email.timestamp}</span>
      </div> `;

      emails_container.appendChild(email_div);

      // click for mail details 
      email_div.addEventListener('click', function() {
        email_details(email_div.dataset.id, mailbox);
        mark_read(email_div.dataset.id);
        
      });

      
    });
    
  });
}
function mark_read(email_id) {
  // update the read attribute into "read"
  fetch(`/emails/${email_id}`, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
})
}

function send_email(event) {
  event.preventDefault();

  // get info 
  const recipents = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // post info 
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipents,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {

    //  result
    console.log(result);

    const error = result.error;
    if (error) {
      alert(error);
    } else {
      load_mailbox('sent')
    }
  });
}
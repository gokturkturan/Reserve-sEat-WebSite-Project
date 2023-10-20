const style = `
    background: #eee;
    padding: 20px;
    border-radius: 20px;
`;

const emailTemplate = (receiver, content, sender, subject) => {
  return {
    Source: '"Reserve sEat" <' + sender + ">",
    Destination: { ToAddresses: [receiver] },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                <html>
                    <div style="${style}">
                        <h1><span style="color:blue">Reserve sEat</span></h1>
                        ${content}
                        <p>Reserve sEat &copy; ${new Date().getFullYear()}</p>
                    </div>
                </html>
              `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };
};

export default emailTemplate;

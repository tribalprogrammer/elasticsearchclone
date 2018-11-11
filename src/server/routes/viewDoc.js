const { rootPath } = require('./utils/common');

module.exports = (request, response) => {
  const uid = request.params.docid;
  if (!uid) {
    return response.redirect('/');
  }
  let html;
  try {
    const {title, content} = require(`${rootPath}/data/${uid}`);
    html = `
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body style="background-color: #282c34">
          <div style="
            display: flex;
            flex-direction:
            column;
            align-items: center;
            min-width: 50%;"
          >
            <h2 style="color: #D5D5D7; width: 50%;">${title}</h2>
            <hr style="color: #D5D5D7; width: 50%;"/>
            <p style="color: #D5D5D7; width: 50%;">${content}</p>
          </div>
        </body>
      </html>
    `;
  } catch (e) {
    response.statusCode = 404;
    return response.send("Hello. You likely made a typo. There's nothing here");
  }
  
  response.set('content-type', 'text/html');
  return response.send(html);
};
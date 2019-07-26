var hbs = require('hbs');
var htmlToText = require('html-to-text');

function registerHbsHelper() {
    displayMesages();
    displayPosts();
}

function displayPosts() {
    hbs.handlebars.registerHelper("displayPosts", function (posts) {
        let template = '<div class="row">';
        for (let post of posts) {
            const text = htmlToText.fromString('<h1>Hello World</h1>', {
                wordwrap: 130
            });
            template += `
            <div class="col-md-3">
                <div class="card" style="width:100%">
                    <img class="card-img-top" src="${post.thumb}" alt="Card image">
                    <div class="card-body">
                        <h4 class="card-title">${post.title}</h4>
                        <p class="card-text">${htmlToText.fromString(post.content, {
                wordwrap: 130
            }).substr(0, 100)}</p>
                        <a href="/post/${post._id}" class="btn btn-primary">See Detail</a>
                </div>
            </div>
            </div>
            `;
        }

        template += `</div>`;

        return new hbs.handlebars.SafeString(template);
    });
}

function displayMesages() {
    hbs.handlebars.registerHelper("display", function (messages) {
        if (Object.keys(messages).length !== 0) {
            let str = `<div>@@</div>`;
            for (let i in messages) {
                let s = '';
                console.log(i);
                let option = {
                    error: `<div class="alert alert-danger">`,
                    success: `<div class="alert alert-success">`
                }

                for (let j in messages[i]) {
                    s += `${option[i]}${messages[i][j]}</div>`
                }

                str = str.replace('@@', s);
            }

            console.log(str);
            return new hbs.handlebars.SafeString(str);
        }
        else {
            return new hbs.handlebars.SafeString('');
        }
    });
}


module.exports = registerHbsHelper;

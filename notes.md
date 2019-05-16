SELECT songs.name AS song_name, singers.name AS singer_name
FROM singers
JOIN songs
ON singers.id = songs.singer_id;

default is inner join
see doc in git

LEFT JOIN for user login to match signatures

after /registration
redirect to /profile check input. make query if input
redirect to /petition

{{#if url}}
<a href="{{url}}">{{first} {last}}
{{/if url}}

the url needs to begin with:

http://

https://

//

prepend http

Do this when they submit the form in the post route

handle it: throwing the url out, or prepend http:// to it

registration — profile — petition — signed — signers

const csurf = require("csurf");

app.use(csurf());

app.use((req,res, next) => {
res.locals.csrfToken = req.csrfToken();
res.setHeader('x-frame-options', 'DENY');
next();
})

<input name="_csrf" type="hidden" value="{{csrfToken}}">

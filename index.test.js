const supertest = require("supertest");
const { app } = require("./index");

test("GET /test returns an h1 as response", () => {
    return supertest(app)
        .get("/test")
        .then(response => {
            console.log("headers:", response.headers);
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toContain("text/html");
        });
});

test.only("GET /test with no cookies causes redirect", () => {
    return supertest(app)
        .get("/test")
        .then(response => {
            // check statusCode 302 or header location
            console.log("headers:", response.headers);
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/registration");
        });
});

//text, headers, statusCode

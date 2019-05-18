app.post("/edit-profile", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName, lastName, email, password);
    if (!password) {
        Promise.all([db.updateUser(cUserInfo), db.upsertUserProfile(age, city, homepage)])
            .then(qResonses => {
                console.log(qResonses);
            })
            .catch(err => console.log(err));
    } else if (password) {
        hash newPass
        Promise.all([db.updateUser(cUserInfo), db.upsertUserProfile(req.body)])
    }
    //2 different querys
    //Promise.all([db.updateUser(cUserInfo), db.upsertUserProfile(req.body)]);
    //     .then(qResonses => {
    //         console.log(qResonses);
    //     })
    //     .catch(err => console.log(err));
});

const mongoose = require('mongoose')
const Mockgoose = require('mockgoose').Mockgoose
const { expect } = require('chai')
const request = require('supertest')
const app = require('../server')
const models = require('../database/models')

var mockgoose = new Mockgoose(mongoose)

describe("Accounts", () => {

    before(done => {
        mockgoose.prepareStorage().then(() => {
            mongoose.connect("mongodb://localhost:27017/test");
            mongoose.connection.on("connected", async () => {
               
                const user = new models.UserAccount({
                    username: "mocha_test_dupe_account",
                    password: "123",
                    fname: "First",
                    lname: "Last"
                })

                await user.save()

                done()
            })
        })
    })
      
    describe("Register", () => {

        it("Should register a user with the correct details given", () => {
      
            const user = {
                username: "mocha_test_account",
                fname: "First",
                lname: "Last",
                password: "123"
            }
          
            return request(app)
                .post("/user")
                .send(user)
                .expect(200)
                .then(response => {
                    console.log(response.body)
                    expect(response.body.user).to.be.an("object")
                })
        })

        /**
         * THIS TEST FAILS, but in real world cases it does not. I expect mockgoose to retain
         * the database state between tests (and my reading online also asserts this) - but
         * the user posted in the previous test is lost.
         */
        it("Should not allow duplicate usernames", () => {

            const user = {
                username: "mocha_test_dupe_account",
                fname: "First",
                lname: "Last",
                password: "123"
            }

            return request(app)
                .post("/user")
                .send(user)
                .expect(200)
                .then(response => {
                    expect(response.body.user).to.equal(false)
                })
        })

        it("Should hash the password", () => {

            const user = {
                username: "mocha_test_account",
                fname: "First",
                lname: "Last",
                password: "123"
            }

            return request(app)
                .post("/user")
                .send(user)
                .expect(200)
                .then(response => {
                    expect(response.body.user.password).to.not.equal(user.password)
                })
        })
    })

    describe("Authenticate", () => {

        it("Should authenticate a user and return a session cookie when given the correct username and password", () => {

            const body = {
                username: "mocha_test_account",
                password: "123"
            }

            return request(app)
                .post("/user/auth")
                .send(body)
                .expect(200)
                .expect("Set-Cookie", /connect.sid/)
                .then(response => {
                    console.log(response.body)
                    expect(response.body.message).to.equal("Successfully logged in")
                })
        })
    })

    describe("Submitting media", () => {

        it("Should fail to post when not authenticated", () => {

            const post = {
                title: "Mocha Test Post",
                uri: "http://example.com/",
                tags: ["Tag1", "Tag2", "Tag3"],
                description: "A description",
                isPublic: false
            }

            return request(app)
                .post("/media")
                .send(post)
                .expect(401)
        })
    })

    after(() => {
        mongoose.disconnect()
    })
})
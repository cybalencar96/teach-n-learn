// module to hash passwords
var bcrypt = require('bcrypt');

var mongoose = require('mongoose');

// 
const SALT_FACTOR = 10;

// creating a database table schema, i think?
var userSchema = mongoose.Schema({
    username: {type:String, required:true},
    email: {type:String, required:true,unique:true},
    password: {type:String, required: true},
    createdAt: {type:Date, default:Date.now}
});

// pre-save, before saving, implement the fuction on the side
userSchema.pre("save", function(done) {
    var user = this;

    // if password hasn't modified, leave
    if (!user.isModified("password")) {
        return done();
    }

    // i think salt means to get hash complex (salgar o password)
    bcrypt.genSalt(SALT_FACTOR, function(err,salt) {
        // if there was an error, leave
        if(err) { return done(err);}

        // if not error, hash the password
        bcrypt.hash(user.password, salt, function(err,hashedPassword) {
            // if there was an error, leave
            if(err) {return done(err);}
            user.password = hashedPassword;
            done();
        });
    });
});

// metodo para comparar password. O guess é o que a tentativa de password
userSchema.methods.checkPassword = function(guess, done){
    if (this.password != null) {
        // compare password fornecido com o hash do password que está no database
        bcrypt.compare(guess, this.password, function(err, isMatch){
            // sairá com erro (senha não bateu) ou isMatch, senha bateu
            done(err, isMatch);
        });
    }
}
// and now creating the table User using the schema above
var User = mongoose.model("User", userSchema);

module.exports = User;
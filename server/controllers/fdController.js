const { reset } = require('nodemon');

exports.homepage = async(req, res) => {
    try{
        res.render('index'), {title: 'F&D - Homepage'}
    }catch(error){
        res.status(500).send({message: error.message || "Error Occured"})
    }
}
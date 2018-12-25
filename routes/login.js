module.exports = {



    get: async (req, res) => {

        res.render('pages/login');

    },

    post: async (req, res) => {

       console.log(req.body)
        res.json(req.body)


    },
    logout: async (req, res) => {


    }



}



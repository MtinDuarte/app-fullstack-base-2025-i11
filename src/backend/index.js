//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;
const ALLOWED_ATTRIBUTES = ['name', 'description', 'state', 'type'];
const ALLOWED_STATES = ['0','1'];

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

/* 
    Get all consolidated devices in database... 
*/
app.get('/devices/', function(req, res, next) {

    utils.query("SELECT * FROM Devices",function(error,respuesta,campos){
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});
/**
 *  Get device resource by id
 */
app.get('/devices/:id', function(req, res, next) {
    utils.query("SELECT * FROM Devices where id = "+req.params.id, function(error,respuesta,campos)
    {
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});

/* 
    Modify 1 device field per request using patch... 
*/
app.patch('/devices/:id/:attribute/:value',function(req,res,next){
    
    const { id, attribute, value } = req.params;

    if (!ALLOWED_ATTRIBUTES.includes(attribute))
        return res.status(400).send({ error: `Invalid device attribute: ${attribute}`});
    
    if(!ALLOWED_STATES.includes(value))
        return res.status(400).send({ error: `Invalid device state: ${value}`});

    const query = `UPDATE Devices SET ${attribute} = ? WHERE id = ?`;
    console.log(query, [value, id]);

    utils.query(query, [value, id], function (error, respuesta) 
    {
        if (error == null) 
        {
        console.log(respuesta);
        return res.status(200).send(respuesta);
        } else {
        console.log(error);
        return res.status(409).send({ error: 'Failed request' });
        }
    })
});
/**
 * Register a new device...  
 */
app.post('/devices/:name/:description/:value/:type',function(req,res,next)
{
    const { name, description, value, type } = req.params;

    /* ToDo hacer un select para verificar que el elemento no existe.    */
    const query = `INSERT INTO Devices(name,description,state,type) VALUES(?,?,?,?)`;
    
    console.log(query, [name, description, value, type]);

    utils.query(query, [name, description, value, type], function (error, respuesta) 
    {
        if (error == null) 
        {
            console.log(respuesta);
            return res.status(200).send(respuesta);
            } else {
            console.log(error);
            return res.status(409).send({ error: 'Failed request' });
        }
    })
});

/** 
 * DELETE a device   
 */
app.delete('/devices/:id',function(req,res,next)
{
    const { id } = req.params;
/* ToDo hacer un select para verificar que el elemento no existe.    */
    const query = `DELETE FROM  Devices WHERE id = ?`;

    console.log(query, [id]);

    utils.query(query, [id], function (error, respuesta) 
    {
        if (error == null) 
        {
            console.log(respuesta);
            return res.status(200).send(respuesta);
        } 
        else 
        {
            console.log(error);
            return res.status(409).send({ error: 'Failed request' });
        }
    })
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================

import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import{ Grid, Typography, TextField, Fab, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import config from './config';
import BrokenImage from '@material-ui/icons/BrokenImage';
import LocalShipping from '@material-ui/icons/LocalShipping';
import CheckCircle from '@material-ui/icons/CheckCircle';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
      
    },
    gridContainer: {
        borderTop: '2px solid #9e9e9e',
        textAlign: 'center',
    },
    primaryButton:{
        background: '#2A6A9E',
        color: 'white',
        margin: theme.spacing(1),
        '&:hover':{
            background: '#5E99C5',
        },
    },
    secondaryButton: {

    }
  }));

const Product = ({bucket, quantityType, isUpdated}) => {

    //Estado de la cantidad ingresada por input
    const [quantitySelected, setQuantitySelected] = useState(0);

    const [open, setOpen] = useState(false);

    const classes = useStyles();

    //Suma unidades a Disponible y resta desde el origen por parametro
    const sendToAviable= (fromBucketType) =>{
        const bucketBody = {
            "availableToSellQuantity": bucket.availableToSellQuantity,
            "brokenQuantity": bucket.brokenQuantity,
            "id": bucket.id,
            "inChargeQuantity": bucket.inChargeQuantity,
            "product": bucket.product
          };

        if(fromBucketType === config.bucketType.inCharge){
            bucketBody.inChargeQuantity-=quantitySelected;
        }else{  
            bucketBody.brokenQuantity-=quantitySelected;
        }
        
        bucketBody.availableToSellQuantity+=quantitySelected;
        
        const putRequest = {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${config.authToken}`,   
            'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(bucketBody)
        };

        fetch("http://localhost:8080/api/product-buckets",putRequest)
        .then(res => {isUpdated(true); setOpen(true)})
        .catch(error => error);
    };

    //Suma unidades a Encargado y resta desde el origen por parametro
    const sendToInCharge = (fromBucketType) =>{
        const bucketBody = {
            "availableToSellQuantity": bucket.availableToSellQuantity,
            "brokenQuantity": bucket.brokenQuantity,
            "id": bucket.id,
            "inChargeQuantity": bucket.inChargeQuantity,
            "product": bucket.product
          };

        if(fromBucketType === config.bucketType.aviable){
            bucketBody.availableToSellQuantity-=quantitySelected;
        }else{  
            bucketBody.brokenQuantity-=quantitySelected;
        }
        
        bucketBody.inChargeQuantity+=quantitySelected;
        
        const putRequest = {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${config.authToken}`,   
            'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(bucketBody)
        };

        fetch("http://localhost:8080/api/product-buckets",putRequest)
        .then(res => {isUpdated(true); setOpen(true)})
        .catch(error => error);

    };

    //Suma unidades a Rotos y resta desde el origen por parametro
    const sendToBroken = (fromBucketType) =>{
        const bucketBody = {
            "availableToSellQuantity": bucket.availableToSellQuantity,
            "brokenQuantity": bucket.brokenQuantity,
            "id": bucket.id,
            "inChargeQuantity": bucket.inChargeQuantity,
            "product": bucket.product
          };

        if(fromBucketType === config.bucketType.aviable){
            bucketBody.availableToSellQuantity-=quantitySelected;
        }else{  
            bucketBody.inChargeQuantity-=quantitySelected;
        }
        
        bucketBody.brokenQuantity+=quantitySelected;
        
        const putRequest = {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${config.authToken}`,   
            'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(bucketBody)
        };

        fetch("http://localhost:8080/api/product-buckets",putRequest)
        .then(res => {isUpdated(true);setOpen(true)})
        .catch(error => error);
    };

    //Actualiza y limita las unidades ingresadas por input
    const handleInputChange = (event) => {
        const inputValue = Number(event.target.value);

        inputValue < 0 ? (event.target.value=0) : (inputValue > bucket[quantityType] ? event.target.value= bucket[quantityType] : event.target.value=inputValue);

        setQuantitySelected(Number(event.target.value));
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };


    return(
        
        <Grid container spacing={3} className={classes.gridContainer} justify="center" alignItems="center">
            <Grid item xs={3}>
                <Typography variant="body1">{bucket.product.name}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="body1">{bucket[quantityType]}</Typography>
            </Grid>
            <Grid item xs={3}>
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField id={`product-${bucket.product.id}-selected`} label="Cantidad" variant="outlined" type="number" onChange={handleInputChange} InputProps={{ inputProps: { min: 0, max: bucket[quantityType] }}}/>
                </form>
            </Grid>
            
                {quantityType === config.bucketType.aviable ? (
                    <Grid item xs={3}>
                         <Fab className={classes.primaryButton} aria-label="add" onClick={() => sendToInCharge(quantityType)}>
                            <LocalShipping></LocalShipping>
                        </Fab>
                        <Fab color="default" aria-label="add" onClick={() => sendToBroken(quantityType)}>
                            <BrokenImage></BrokenImage>
                        </Fab>
                    </Grid>
                ):(
                    quantityType === config.bucketType.inCharge ? (
                        <Grid item xs={3}>
                            <Fab className={classes.primaryButton} aria-label="add" onClick={() => sendToAviable(quantityType)}>
                                <CheckCircle></CheckCircle>
                            </Fab>
                            <Fab color="default" aria-label="add" onClick={() => sendToBroken(quantityType)}>
                                <BrokenImage></BrokenImage>
                            </Fab>
                        </Grid>
                    ):(
                        <Grid item xs={3}>
                            <Fab className={classes.primaryButton} aria-label="add" onClick={() => sendToAviable(quantityType)}>
                                <CheckCircle></CheckCircle>
                            </Fab>
                            <Fab color="default" aria-label="add" onClick={() => sendToInCharge(quantityType)}>
                                <LocalShipping></LocalShipping>
                            </Fab>
                        </Grid>
                    )
                )}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {`Los productos ${bucket.product.name} fueron despachados exitosamente`}
                </Alert>
            </Snackbar>
        </Grid>    
        
    )
};

export default Product;
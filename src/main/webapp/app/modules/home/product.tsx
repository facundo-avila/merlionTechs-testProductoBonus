import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import{ Grid, Typography, Button, TextField, Box } from '@material-ui/core';
import config from './config';

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
    }
  }));

const Product = ({bucket, quantityType, isUpdated}) => {

    const [quantitySelected, setQuantitySelected] = useState(0);

    const classes = useStyles();

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
        .then(res => isUpdated(true))
        .catch(error => error);
    };

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
        .then(res => isUpdated(true))
        .catch(error => error);

    };

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
        .then(res => isUpdated(true))
        .catch(error => error);
    };

    const handleInputChange = (event) => {
        const inputValue = Number(event.target.value);

        inputValue < 0 ? (event.target.value=0) : (inputValue > bucket[quantityType] ? event.target.value= bucket[quantityType] : event.target.value=inputValue);

        setQuantitySelected(Number(event.target.value));
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
                        <Button variant="contained" color="primary" onClick={() => sendToInCharge(quantityType)}>
                            Enviar a Entregados
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => sendToBroken(quantityType)}>
                            Enviar a Rotos
                        </Button>
                    </Grid>
                ):(
                    quantityType === config.bucketType.inCharge ? (
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" onClick={() => sendToAviable(quantityType)}>
                                Enviar a Disponible
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => sendToBroken(quantityType)}>
                                Enviar a Rotos
                            </Button>
                        </Grid>
                    ):(
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" onClick={() => sendToAviable(quantityType)}>
                                Enviar a Disponible
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => sendToInCharge(quantityType)}>
                                Enviar a Entregados
                            </Button>
                        </Grid>
                    )
                )}
              
        </Grid>    
        
    )
};

export default Product;
export default {
    bucketType: {
        aviable: "availableToSellQuantity",
        inCharge: "inChargeQuantity",
        broken: "brokenQuantity"
    },
    authToken: JSON.parse(sessionStorage.getItem("jhi-authenticationToken")),
}
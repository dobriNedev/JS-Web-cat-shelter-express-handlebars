exports.testReq = (req) => {
    const reqK = Object.keys(req);
    console.log(`reqK:${ reqK }`)
    const reqBodyK = Object.keys(req.body);
    console.log(`reqBodyK:${ reqBodyK}`);
    const reqParamsK = Object.keys(req.params);
    console.log(`reqParamsK:${ reqParamsK}`);
    const reqQueryK = Object.keys(req.query);
    console.log(`reqQueryK:${ reqQueryK}`);
}

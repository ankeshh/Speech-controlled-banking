const handleTransaction = (req,res,db) => {
    const {sender_acc, receiver_acc, amount, transfer_fee, transfer_info} = req.body;
    if(!sender_acc || !receiver_acc || !amount || sender_acc === receiver_acc)
        return res.status(400).json('Check your details and try again');
    console.log(req.body);
    //do text categorisation here 

    let url = "https://api.uclassify.com/v1/uClassify/Topics/classify/?readKey=OFOaYEiFgsN3&text=";
    let arr = transfer_info.trim().split(" ");
            for (let i = 0; i < arr.length-1; i++) {
                url += arr[i] + "+";
              }
            url+=arr[arr.length-1];
            fetch(url)
                .then(response=>response.json())
                .then(data=> {
                    console.log(data);
                })
                .catch(err => console.log(err,"classify error"));


    db.select('acc_no','balance','acc_owner','acc_type','acc_limit').from('acc_balance').where('acc_no','=',sender_acc).then(data => {
        if(parseInt(data[0].balance)>=parseInt(amount)){
            var flag=false;
            //console.log("condition1 ",parseInt(amount) >= (0.75*parseInt(data[0].acc_limit)));
            //console.log(data[0].acc_type.localeCompare("current"));
            if(parseInt(amount) >= (0.75*parseInt(data[0].acc_limit)) && data[0].acc_type=="current"){
                console.log("inside the conditional");
                // const trans = parseInt(data[0].balance)+50;
                //const s_bal = 500;
                db.select('acc_no','balance').from('acc_balance').where('acc_owner','=',data[0].acc_owner).andWhere('acc_type','=','Saving').then(dt =>{
                    // console.log(dt[0].acc_no);
                    // console.log(dt[0].balance);
                    const s_acc = parseInt(dt[0].acc_no);
                    const savbalance = parseInt(dt[0].balance)+50;
                    // console.log(s_acc);
                    // console.log(savbalance);
                    db('acc_balance').update('balance',savbalance).where('acc_no','=',s_acc).then(
                        //res.json("Amount transfered")
                        console.log("Amount 50 transferred to saving")
                    )
                })
                .catch(err => console.log(err));
                // console.log(s_acc);
                // console.log(savbalance+50);
                //db.select('balance').from('acc_balance').where('acc_no','=',s_acc).then(ddt => {
                
                // db('acc_balance').update('balance',savbalance).where('acc_no','=',s_acc).then(
                //         //res.json("Amount transfered")
                //         console.log("Amount 50 transferred to saving")
                //         .catch(err => {return res.status(400).json("failed, try again later")})
                //     )
                
                //})
                flag=true;
            }
            //else {
            if(flag==false)
                    var remainBalance= parseInt(data[0].balance)-parseInt(amount)-parseInt(transfer_fee);
                else
                    var remainBalance= parseInt(data[0].balance)-parseInt(amount)-parseInt(transfer_fee)-50;
            const acc_sender_id = data[0].acc_owner; 
            db('acc_balance').update('balance', remainBalance).where('acc_no','=',sender_acc).then(
                    db('tranlog').insert({
                        id: acc_sender_id,
                        from_acc: sender_acc,
                        to_acc: receiver_acc,
                        amount: amount,
                        balance: remainBalance
                    }).returning('*').then(
                        db.select('acc_no','balance','acc_owner').from('acc_balance').where('acc_no','=',receiver_acc).then(data =>{
                            console.log(data[0].balance);
                            const newBalance = parseInt(amount) + parseInt(data[0].balance);
                            const acc_receiver_id = data[0].acc_owner;

                            db('acc_balance').update('balance',newBalance).where('acc_no','=',receiver_acc).then(
                                db('tranlog').insert({
                                    id: acc_receiver_id,
                                    from_acc: sender_acc,
                                    to_acc: receiver_acc,
                                    amount: amount,
                                    balance: newBalance,
                                    info: transfer_info
                                }).then(
                                    db('message')
                                    .insert({
                                        user_id: acc_receiver_id,
                                        description: `Amount of ${amount} was received from ${sender_acc}`
                                    })
                                    .then(
                                        db('message')
                                        .insert({
                                            user_id: acc_sender_id,
                                            description: `Amount of ${amount} was transfered to ${receiver_acc}`
                                        }).catch(err => console.log(err))
                                    )
                                )
                            )
                            .then(res.json("Amount transfered"))
                            .catch(err => {res.status(400).json('Unable to update at receivers end')});
                        }).catch(err => {return res.status(400).json('Check your details and try again')})
                    )
                );
            //}
            
        }
        else
            return res.json('Insufficient balance');
    }).catch(err => {return res.status(400).json('Unable to transfer. Try again later');});

    
}

module.exports = {
    handleTransaction
};
exports.processPayment = (req, res) => {
    const { amount } = req.body;
  
    // Thực hiện gọi API MoMo tại đây (giả lập phản hồi thành công)
    setTimeout(() => {
      res.json({ success: true });
    }, 2000);
  };
  
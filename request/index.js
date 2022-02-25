// 同时发送异步代码的次数
let ajaxTimes = 0;
export const request=(params)=> {
    let header={};
    if(!params.url.includes("/notToken")) {
        // 拼接header
        header["Authorization"]=wx.getStorageSync("token");
          
    }



    ajaxTimes++;
    //显示加载中效果
    wx.showLoading({
        title: "加载中",
        mask: true
    });
      
    // 定义公共的url
    const baseUrl = "http://1.15.186.9:8006";
    return new Promise((resolve,reject)=> {
        wx.request({
            ...params,
            url: baseUrl+params.url,
            header: header,
            success:(result)=> {
                resolve(result.data)
            },
            fail:(err)=> {
                reject(err)
            },
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes===0) {
                    //关闭正在等待的图标
                    wx.hideLoading();
                }
                  
            }
        });
          
    })
}
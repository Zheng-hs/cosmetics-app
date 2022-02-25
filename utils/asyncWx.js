/*
promise形式getSetting
*/
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {}
        });

    })
}
/*
promise形式chooseAddress
*/
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {}
        });

    })
}
/*
promise形式openSetting
*/
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {}
        });

    })
}

export const showModal = ({
    content
}) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (result) => {
                // if (result.confirm) {
                //     cart.splice(index, 1);
                //     this.setCart(cart);
                // } else if (result.cancel) {
                //     console.log('yonghu');
                // }
                resolve(result);
            },
            fail: (err) => {
                reject(err)
            }
        });

    })
}

export const showToast = ({
    title
}) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err)
            }
        });

    })
}

export const login = () => {
    return new Promise((resolve, reject) => {
       wx.login({
           timeout:10000,
           success: (result) => {
               resolve(result)
           },
           fail: (err) => {
               reject(err)
           },
           complete: () => {}
       });
         

    })
}
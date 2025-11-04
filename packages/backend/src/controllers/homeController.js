/**
 * @description 渲染首页
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export const getHomePage = (req, res) => {
    res.status(200).send('<h1>欢迎来到首页</h1>');
};

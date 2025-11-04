// 模拟用户数据
const users = [
  { id: 1, username: "admin", password: "123" },
  { id: 2, username: "user", password: "123" },
];

/**
 * @description 用户登录
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export const login = (req, res) => {
  const { username, password } = req.body;

  // 查找用户
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // 登录成功
    res.status(200).json({
      code: 0,
      message: "登录成功",
      data: {
        userId: user.id,
        username: user.username,
        token: `fake-token-for-${username}`, // 签发一个假的token
      },
    });
  } else {
    // 登录失败
    res.status(401).json({
      code: 1,
      message: "用户名或密码错误",
    });
  }
};

/**
 * @description 校验令牌有效性
 * 支持从 Authorization: Bearer <token>、query.token、body.token 读取令牌
 * 令牌格式为：fake-token-for-<username>
 */
export const verifyToken = (req, res) => {
  let token = null;
  // 优先从 Authorization 头读取
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === "string") {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  // 其次从 query 或 body 读取
  if (!token) token = req.query?.token;
  if (!token) token = req.body?.token;

  if (!token) {
    return res.status(400).json({ code: 1, message: "缺少令牌" });
  }

  // 简单校验：解析出用户名，并在内置用户列表中匹配
  const prefix = "fake-token-for-";
  if (!token.startsWith(prefix)) {
    return res.status(401).json({ code: 1, message: "令牌格式错误" });
  }

  const username = token.substring(prefix.length);
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ code: 1, message: "令牌无效或用户不存在" });
  }

  return res.status(200).json({
    code: 0,
    message: "令牌有效",
    data: {
      userId: user.id,
      username: user.username,
    },
  });
};

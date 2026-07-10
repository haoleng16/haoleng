# FastAPI

> 接口是一组定义了不同软件组件之间如何交互的规则和协议。也叫API
API 允许不同的软件系统通过预定义的接口进行通信，使得开发者能够利用现有的功能和服务，而无需从头开始构建。
在 Python 中，有多种接口开发框架可供选择：FastAPI、Flask、Django等。目前最主流的是 FastAPI。

>FastAPI的作者 Tiangolo（真名 Sebastián Ramírez）是一位来自哥伦比亚、目前居住在德国柏林的著名全职开源维护者。

>在 7 岁时就从天主教学校退学了。在退学之后，他的父母并没有强迫他回到传统学校，而是支持他居家自学。涵盖了英语、算法、机器学习、密码学和人工智能等核心计算机科学领域。

>他在 23 岁左右凭借在 GitHub 上的开源贡献和扎实的技术实力证明了自己，先后在迪拜和德国柏林的知名科技公司（如 Explosion AI 和 Forethought）担任高级/首席工程师。


| 维度           | FastAPI                     | Django                                |
| ------------ | --------------------------- | ------------------------------------- |
| **架构风格**     | 微框架，基于 Starlette 和 Pydantic | 大型框架，支持全栈开发，内置 ORM、Admin 等            |
| **数据验证**     | 内置 Pydantic，支持强类型和自动验证      | 依赖于表单类（如 Forms 和 DRF 的 serializers）   |
| **自动文档生成**   | 内置支持 OpenAPI 和 Swagger UI   | 不原生支持，需依赖 Django REST Framework (DRF) |
| **学习曲线**     | 中等，需了解类型注解和异步编程             | 较高，包含多种内置组件，适合系统性学习                   |
| **可扩展性**     | 高，强大的原生功能减少了扩展需求            | 中等，内置组件强大，但灵活性相对较低                    |
| **依赖注入支持**   | 原生支持依赖注入                    | 无原生支持                                 |
| **Admin 界面** | 无，需要自行开发                    | 原生支持，提供强大的 Admin 管理后台                 |
| **对类型注解的支持** | 原生支持，强类型友好                  | 不直接支持，但可结合第三方库使用                      |
|              |                             |                                       |

## 安装
FastAPI 是一个运行在 ASGI? 服务器上的高性能 Web 框架，它自身并不是一个大而全的框架，它通过绑定其他框架来实现其功能。

- 运行服务是是 Uvicorn?，它是目前最流行的轻量级、超快速的 ASGI 服务器。
- 处理HTTP请求和响应的是starlette?，是FastAPI的底层框架，用于处理HTTP请求和响应。
- 数据验证是 Pydantic?，是FastAPI的底层框架，通常和标准库typing一起使用。

编写FastAPI程序的过程中你会觉得自己在写通用的Python代码，非常友好，安装时推荐安装标准版。
- `pip install fastapi`：只安装核心框架。
- `pip install "fastapi[standard]"`：安装核心框架与常用工具。

## 接口文档
FastAPI 内置了两套根据你的代码自动实时生成的交互式文档。它的逻辑是：

- 解析代码 ：FastAPI 扫描你的路径、参数、Pydantic 模型。
- 生成 OpenAPI 规范 ：自动生成标准JSON API 架构文件 : [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)
- Swagger UI 读取这个文件生成可在线测试的网页: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc 读取这个文件生成易于在线阅读的网页: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)


## 生命周期

| 阶段       | 范畴 (Category)    | 核心组件             | 详细动作说明                                         |
| -------- | ---------------- | ---------------- | ---------------------------------------------- |
| 1. 应用启动  | Lifespan (Start) | lifespan         | 初始化：建立数据库长连接、预加载 AI 模型、配置全局资源。                 |
| 2. 请求接收  | Request          | ASGI Server      | 接收：通过网络套接字（Socket）接收客户端请求。                     |
| 3. 请求拦截  | Request          | Middleware       | 解析与预检：解析 HTTP 报文，处理 CORS、GZip 解压、Session 状态还原。 |
| 4. 路由匹配  | Request          | Router           | 定位：根据 URL 和 Method 找到匹配的路径函数。匹配失败则直接返回 404。    |
| 5. 依赖注入  | Request          | Depends          | 前置准备：执行依赖项（如 Auth 校验、DB Session 开启）。若失败则抛出异常。  |
| 6. 参数校验  | Request          | Pydantic         | 入参验证：将数据转为模型对象并校验格式。校验失败则返回 422。               |
| 7. 业务执行  | Processing       | Path Function    | 逻辑运算：运行你编写的业务代码。若产生错误，将在此处抛出异常。                |
| 8. 异常处理  | Processing       | Exc Handler      | 异常补救：捕获业务异常，将其转换为统一格式的 JSONResponse。           |
| 9. 数据转换  | Response         | jsonable_encoder | 序列化：将 Python 对象、ORM 模型转换为 JSON 兼容的基础数据格式。      |
| 10. 响应校验 | Response         | response_model   | 出参验证：根据 Schema 强制过滤字段（如剔除密码），确保输出安全。           |
| 11. 响应拦截 | Response         | Middleware       | 后处理：最后一次修改 Header（如加签名）、计算耗时、记录访问日志。           |
| 12. 物理发送 | Response         | ASGI Server      | 传输：通过网络套接字（Socket）将字节流正式传回客户端。                 |
| 13. 后台任务 | Post-Response    | BackgroundTasks  | 扫尾：在连接断开后，异步执行耗时操作（如发送邮件、统计数据）。                |
| 14. 应用关闭 | Lifespan (End)   | lifespan         | 释放：关闭数据库连接池，清理内存资源，确保程序优雅退出。                   |

## Lifespan
Lifespan可以将启动时操作和应用关闭时操作写在同一个块代码中，避免人为的遗忘

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

def fake_answer_to_everything_ml_model(x):
    """一个假的机器学习模型，返回一个数的2倍"""
    return x * 2
"""
lifespan只接受异步的上下文管理器。

而asynccontextmanager刚好可以把生成器变成上下文管理器

yield 之前的内容等同于 with 语法执行。

yield 之后的内容等同于 with 语法结束。
"""
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 加载模型（提前加载好模型，每次请求时就不用再耗时加载了）
    # app.state 是一个全局的状态抽屉，你可以把所有全局要用的内容追加到其属性名当中
    app.state.model = fake_answer_to_everything_ml_model
    yield
    del app.state.model
    print("安全的关闭数据库并清理内存空间")

app = FastAPI(lifespan=lifespan)

# 请求约定与路由
@app.get("/")
# 自动读取类型标注为格式验证
async def predict(x:float) :
    result = app.state.model(x)
    return {"result": result}
```

你可以通过`http://127.0.0.1:8000/?x=1`访问，结果是`{"result": 2}`。

更推荐通过浏览器访问`http://127.0.0.1:8000/docs`。

点击`Try it out`按钮，填写参数，点击`Execute`按钮，查看结果。

## 接受请求
前端大部分的请求是通过浏览器发送请求到后端，后端接收请求并处理，最后返回响应给前端。

>为了最大限度压榨计算的能力。Uvicorn可以启动多个相同的实例.
推荐通过命令行启动多work：`uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4`
Uvicorn多Worker通过多进程，创建多个完全一样的副本，运行时不同副本完全隔离。因此全局变量的正确做法是用Redis等外部存储。
多Worker监听同一个端口，如何调度？不是Uvicorn自己实现，调度由操作系统内核完成。

**请求是一种相当复杂的数据类型。**

## 请求方法
请求方法是指浏览器发送请求到后端时，所使用的方法。浏览器直接打开某个地址，就是GET方法。
方法的本身带有一定的语义，比如:GET方法表示获取资源

| 方法      | 语义     | 带Body   | 幂等  | 安全  | 可缓存 |
| ------- | ------ | ------- | --- | --- | --- |
| GET     | 获取资源   | ❌ 否     | ✅ 是 | ✅ 是 | ✅ 是 |
| POST    | 创建资源   | ✅ 是     | ❌ 否 | ❌ 否 | ❌ 否 |
| PUT     | 更新(全量) | ✅ 是     | ✅ 是 | ❌ 否 | ❌ 否 |
| PATCH   | 更新(局部) | ✅ 是     | ❌ 否 | ❌ 否 | ❌ 否 |
| DELETE  | 删除资源   | ⚠️ 建议不带 | ✅ 是 | ❌ 否 | ❌ 否 |
| OPTIONS | 探测支持   | ❌ 否     | ✅ 是 | ✅ 是 | ❌ 否 |

>幂等性
>同一个操作执行1次和执行100次，对系统资源的影响是否一致

- 幂等(sage/Idempotent):Get:查100次，数据不会变
- 非幂等(Non-Idempotent): POST:每点一次"提交"，后端就创建一个新订单，点100次，就会产生100个订单

>缓存机制(CACHING)

- GET是可以被浏览器、CDN、代理服务器自动缓存的
- POST默认不会被缓存。这保证了金融交易、账号注册等操作必须实时到达后端

>安全性
这里的"安全"是指"是否会修改服务器数据"

- 安全：GET理论上只读，不应该引起服务器状态变化
- 不安全：POST、PUT、PATCH、DELETE是不安全的，因为它们会改变数据库

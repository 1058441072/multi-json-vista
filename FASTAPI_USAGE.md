# FastAPI + Multi-JSON Editor 使用指南

## 📦 安装依赖

```bash
pip install fastapi uvicorn jinja2
```

## 🚀 快速开始

### 1. 基本使用

```python
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
```

### 2. 传输初始数据

```python
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    # 准备要传输的JSON数据
    backend_data = [
        {
            "name": "用户数据",
            "data": {
                "id": 1,
                "name": "张三",
                "email": "zhangsan@example.com"
            }
        },
        {
            "name": "产品信息",
            "data": {
                "product_id": 101,
                "title": "示例产品",
                "price": 99.99
            }
        }
    ]
    
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "backend_data": backend_data  # 传输数据
        }
    )
```

### 3. 动态API端点

前端的"Load from Backend"按钮会调用 `/api/jsons` 端点：

```python
@app.get("/api/jsons")
async def get_jsons():
    # 从数据库、文件或其他来源获取数据
    return [
        {
            "name": "实时数据1",
            "data": {"timestamp": "2025-01-01", "value": 42}
        },
        {
            "name": "实时数据2",
            "data": {"items": [1, 2, 3], "total": 3}
        }
    ]
```

## 📁 项目结构

```
your_project/
├── templates/
│   └── index.html          # HTML模板文件
├── fastapi_example.py      # FastAPI示例代码
└── FASTAPI_USAGE.md        # 本文件
```

## 🎯 运行应用

```bash
# 开发模式（自动重载）
uvicorn fastapi_example:app --reload

# 生产模式
uvicorn fastapi_example:app --host 0.0.0.0 --port 8000
```

访问：http://localhost:8000

## 💡 数据格式说明

### 初始数据格式（backend_data）

```python
backend_data = [
    {
        "name": "显示名称",        # JSON的名称（显示在标题栏）
        "data": {                # 实际的JSON数据
            "key": "value",
            # ... 任意JSON结构
        }
    }
]
```

### API端点返回格式（/api/jsons）

```json
[
    {
        "name": "数据名称",
        "data": {
            "any": "json structure"
        }
    }
]
```

## 🔧 高级用法

### 1. 从数据库加载

```python
from sqlalchemy.orm import Session

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request, db: Session = Depends(get_db)):
    # 从数据库查询JSON数据
    json_records = db.query(JsonData).all()
    
    backend_data = [
        {
            "name": record.name,
            "data": record.json_content
        }
        for record in json_records
    ]
    
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "backend_data": backend_data}
    )
```

### 2. 从文件加载

```python
import json
from pathlib import Path

@app.get("/load-files", response_class=HTMLResponse)
async def load_files(request: Request):
    data_dir = Path("data")
    backend_data = []
    
    for json_file in data_dir.glob("*.json"):
        with open(json_file) as f:
            backend_data.append({
                "name": json_file.stem,
                "data": json.load(f)
            })
    
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "backend_data": backend_data}
    )
```

### 3. 条件渲染

```python
@app.get("/editor", response_class=HTMLResponse)
async def editor(
    request: Request,
    load_data: bool = False
):
    backend_data = []
    
    if load_data:
        # 只有在需要时才加载数据
        backend_data = fetch_data_from_source()
    
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "backend_data": backend_data}
    )
```

## 🎨 功能特性

✅ **上传JSON文件** - 支持多文件上传  
✅ **粘贴JSON** - 直接粘贴JSON文本  
✅ **从后端加载** - 调用 `/api/jsons` 动态加载  
✅ **实时编辑** - 可视化编辑JSON树  
✅ **搜索功能** - 搜索键和值  
✅ **导出功能** - 导出单个或全部JSON  
✅ **格式化** - 自动格式化显示  
✅ **自适应布局** - 根据JSON数量自动调整列数

## 🔍 故障排除

### 模板未找到错误

确保 `templates` 目录存在且包含 `index.html`：

```
templates/
└── index.html
```

### CORS错误

如果需要跨域访问API：

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📚 参考资源

- [FastAPI官方文档](https://fastapi.tiangolo.com/)
- [Jinja2模板文档](https://jinja.palletsprojects.com/)
- [Tailwind CSS文档](https://tailwindcss.com/)

## 🤝 技术支持

遇到问题？检查：
1. Python版本 >= 3.7
2. 所有依赖已安装
3. templates目录路径正确
4. JSON数据格式符合规范

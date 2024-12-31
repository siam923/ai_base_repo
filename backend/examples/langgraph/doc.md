## Lang graph setup
Requirement: Need account in langsmith 

Install langgraph cli :

```
pip install langchain-cli[inmem]
pip install --upgrade "langgraph-cli[inmem]"
```

Create a template
`langgraph new path/to/your/app --template react-agent-js`

Using docker:
```
langgraph up. 
```

Then go to 
`
https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:8123
`

OR it might also work if container is already running:

Run server:
`langgraph dev`

`
https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024`
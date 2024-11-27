import axios from 'axios'
import { useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { message, Upload, Form, Input, Button } from 'antd'

const { Dragger } = Upload

export default function App() {
  const [form] = Form.useForm()
  const [filePath, setFilePath] = useState('')
  const [filename, setFilename] = useState('')

  const compress = async (values: { color: string }) => {
    const res = await axios.get('http://localhost:3000/compress', {
      params: { path: filePath, color: values.color },
      responseType: 'arraybuffer',
    })
    const blob = new Blob([res.data], { type: 'image/jpeg' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    message.success('file compressed successfully')
  }

  return (
    <Form
      form={form}
      onFinish={compress}
      style={{ width: 500, margin: '50px auto' }}
    >
      <Form.Item label="color" name="color">
        <Input />
      </Form.Item>
      <Form.Item>
        <Dragger
          name="file"
          action="http://localhost:3000/upload"
          onChange={(info) => {
            const { status, response, name } = info.file
            if (status === 'done') {
              setFilename(name)
              setFilePath(response)
              message.success(`${info.file.name} file uploaded successfully`)
            } else if (status === 'error') {
              message.error(`${info.file.name} file upload failed`)
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">click or drag a file here to upload</p>
        </Dragger>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          compress
        </Button>
      </Form.Item>
    </Form>
  )
}

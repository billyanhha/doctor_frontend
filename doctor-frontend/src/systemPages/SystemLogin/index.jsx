import React from "react";
import "./style.css";
import {Input, Button, Form, Radio} from "antd";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {doctorLogin} from "../../redux/auth";
import {Redirect, Link} from "react-router-dom";
import {useEffect} from "react";
import {getDoctorLogin} from "../../redux/doctor";

const SytemLogin = props => {
    const [loading, setLoading] = useState(false);
    const auth = useSelector(state => state.auth);
    const doctor = useSelector(state => state.doctor);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    if (auth.isLoggedIn) {
        return <Redirect to="/" />;
    }

    const layout = {
        labelCol: {span: 24},
        wrapperCol: {span: 24}
    };

    const login = values => {
        try {
            setLoading(true);
            dispatch(doctorLogin(values));
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 800);
        }
    };

    const onFinishFailed = errorInfo => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div className="default-div system-login">
            <div className="system-login-form">
                <Form {...layout} name="basic" form={form} initialValues={{remember: true}} onFinish={login} onFinishFailed={onFinishFailed}>
                    <Form.Item label="Email" name="email" rules={[{required: true, type: "email", message: "Email sai"}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password" rules={[{required: true, message: "Vui lòng điền mật khẩu"}]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button loading={loading} type="primary" htmlType="submit" block>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
                <Link to="/forgot-password/privacy">Quên mật khẩu?</Link>
            </div>
        </div>
    );
};

export default SytemLogin;

import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory, withRouter, Redirect} from "react-router-dom";
import {useForm, Controller, ErrorMessage} from "react-hook-form";
// import {ErrorMessage} from "@hookform/error-message";

import {Input} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

import {sendMailReset, sendPasswordReset, checkEmailExpired} from "../../redux/account";

import "./style.css";

const ForgotPassword = props => {
    const {isLoad} = useSelector(state => state.ui);
    const sendMailStatus = useSelector(state => state.account.sendMailStatus);
    const resetPasswordStatus = useSelector(state => state.account.resetPassStatus);
    const expiredStatus = useSelector(state => state.account.expiredStatus);
    const tokenUser = useSelector(state => state.auth.token);

    const tokenMail = props.match.params?.token === "privacy" ? null : props.match.params?.token;

    const history = useHistory();
    const dispatch = useDispatch();
    const {register, handleSubmit, watch, errors, control} = useForm({validateCriteriaMode: "all"});

    const handleSendEmail = data => {
        let request = {role: "doctor", recipient: data.email};
        dispatch(sendMailReset(request));
    };

    const handleResetPassword = data => {
        let request = {new_password: data.password, confirm_password: data.password_repeat};
        dispatch(sendPasswordReset(tokenMail, request));
    };

    useEffect(() => {
        if (tokenUser) {
            history.push("/");
        } else {
            if (tokenMail) dispatch(checkEmailExpired(tokenMail));
        }
    }, []);

    if (resetPasswordStatus) {
        return <Redirect to="/login" />;
    }
    if (tokenMail) {
        if (expiredStatus === false) {
            return <Redirect to="/forgot-password/privacy" />;
        } else if (expiredStatus === null) {
            return "";
        }
    }

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-wrapper">
                <div>
                    <div className="forgot-password-img">
                        <img src="https://img.icons8.com/nolan/100/forgot-password.png" />
                    </div>
                    <div className="forgot-password-title"> {!sendMailStatus ? "Đặt lại mật khẩu" : "Đã gửi Email xác nhận"}</div>

                    {!tokenMail ? (
                        <div>
                            {!sendMailStatus ? (
                                <div>
                                    <form onSubmit={handleSubmit(handleSendEmail)}>
                                        <div className="forgot-form-field">
                                            <p className="forgot-form-label">Email</p>
                                            <Controller
                                                as={<Input />}
                                                required
                                                name="email"
                                                type="email"
                                                defaultValue=""
                                                autoFocus
                                                control={control}
                                                ref={register({
                                                    required: "Bạn hãy nhập Email "
                                                })}
                                            />
                                            <ErrorMessage errors={errors} name="email">
                                                {({messages}) =>
                                                    messages &&
                                                    Object.entries(messages).map(([type, message]) => (
                                                        <span className="error-text" key={type}>
                                                            {message}
                                                        </span>
                                                    ))
                                                }
                                            </ErrorMessage>
                                        </div>
                                        <div className="forgot-form-submit">
                                            <button disabled={isLoad} className="forgot-button" type="submit">
                                                {isLoad ? <LoadingOutlined /> : ""} ­ Gửi yêu cầu
                                            </button>
                                        </div>
                                    </form>
                                    <div className="link-to-login">
                                        <Link to="/login">Đến trang đăng nhập</Link>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="forgot-msg">
                                        Email sẽ hết hạn trong <span>10 phút!</span>
                                        <br />
                                        <br />
                                        Xin kiểm tra mục Thư rác (SPAM) hoặc Quảng cáo nếu bạn không thấy Email gửi đến sau 1 phút.
                                    </div>
                                    <button
                                        disabled={isLoad}
                                        className="forgot-button"
                                        variant="outlined"
                                        color="inherit"
                                        onClick={() => history.push("/login")}
                                    >
                                        Đến trang đăng nhập
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(handleResetPassword)}>
                            <div className="forgot-form-field">
                                <p className="forgot-form-label">Mật khẩu mới</p>
                                <Controller
                                    as={<Input.Password />}
                                    required
                                    placeholder="Mật khẩu mới"
                                    name="password"
                                    type="password"
                                    defaultValue=""
                                    control={control}
                                    ref={register({
                                        required: "Bạn hãy nhập mật khẩu ",
                                        minLength: {
                                            value: 6,
                                            message: "Mật khẩu phải có ít nhất 6 kí tự "
                                        },
                                        maxLength: {
                                            value: 14,
                                            message: "Mật khẩu nhiều nhất là 14 kí tự "
                                        }
                                    })}
                                />
                                <ErrorMessage errors={errors} name="password">
                                    {({messages}) =>
                                        messages &&
                                        Object.entries(messages).map(([type, message]) => (
                                            <span className="error-text" key={type}>
                                                {message}
                                            </span>
                                        ))
                                    }
                                </ErrorMessage>

                                <p className="forgot-form-label">Xác nhận mật khẩu</p>
                                <Controller
                                    as={<Input.Password />}
                                    required
                                    name="password_repeat"
                                    placeholder="Xác nhận mật khẩu"
                                    type="password"
                                    defaultValue=""
                                    control={control}
                                    rules={{validate: value => value === watch("password", "") || "Mật khẩu không khớp "}}
                                />
                                <ErrorMessage errors={errors} name="password_repeat">
                                    {({messages}) =>
                                        messages &&
                                        Object.entries(messages).map(([type, message]) => (
                                            <span className="error-text" key={type}>
                                                {message}
                                            </span>
                                        ))
                                    }
                                </ErrorMessage>
                            </div>
                            <div className="forgot-form-submit">
                                <button disabled={isLoad} className="forgot-button" variant="outlined" color="inherit" type="submit">
                                    {isLoad ? <LoadingOutlined /> : ""} Đặt lại mật khẩu
                                </button>
                            </div>

                            <div className="link-to-login">
                                <Link to="/login">Đến trang đăng nhập</Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withRouter(ForgotPassword);

import { NextPage } from 'next';
import Head from 'next/head';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { login } from '../../api/auth';
import Link from 'next/link';
import Cookies from 'js-cookie';
import API from '../../api/index';
import { useRecoilState } from 'recoil';
import { userState } from '../../store/states';
import Title from '../../components/common/Title';

const Login: NextPage = ({}) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [user, setUserstate] = useRecoilState(userState);

  async function submitHandler(event: React.SyntheticEvent) {
    event.preventDefault();

    const enteredEmail = (emailInputRef.current as HTMLInputElement).value;
    const enteredPassword = (passwordInputRef.current as HTMLInputElement)
      .value;

    if (
      enteredEmail.trim().length === 0 ||
      enteredPassword.trim().length === 0
    ) {
      alert('입력을 해주세요.');
      return;
    }
    if (!user.isLogined) {
      const response = await login({
        email: enteredEmail,
        password: enteredPassword,
      });
      if (response.data.status === 'OK') {
        const { accessToken } = response.data;
        Cookies.set('refreshToken', response.data.refreshToken);
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setUserstate({
          isLogined: true,
          address: response.data.address,
          privateKey: response.data.privateKey,
        });
        router.push('/');
      } else {
        alert('다시 확인해주세요. 로그인 할 수 없습니다.');
      }
    } else {
      alert('이미 로그인된 상태입니다. 메인 페이지로 이동합니다.');
      router.push('/');
      return;
    }
  }

  return (
    <>
      <Head>
        <title>로그인</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <main>
        <Title>로그인</Title>
        <form
          onSubmit={submitHandler}
          className="flex flex-col justify-center items-center"
        >
          <FormInput label="이메일" id="email" ref={emailInputRef}></FormInput>
          <FormInput
            label="비밀번호"
            id="password"
            type="password"
            ref={passwordInputRef}
          ></FormInput>
          <div className="flex justify-center content-center">
            <Link href="/auth/signup">
              <Button
                label="회원가입"
                btnType="normal"
                btnSize="medium"
                type="button"
              ></Button>
            </Link>
            <Button
              label="확인"
              btnType="active"
              btnSize="medium"
              type="submit"
            ></Button>
          </div>
        </form>
        <Link href="/auth/findpw">
          <div className="flex justify-center">
            <button className="text-center m-2 font-custom font-medium text-sm text-gray-dark">
              비밀번호 찾기
            </button>
          </div>
        </Link>
      </main>
    </>
  );
};

export default Login;

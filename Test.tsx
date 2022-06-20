import { useState, useRef, ChangeEvent, FocusEvent, Dispatch, SetStateAction, RefObject } from 'react';
import TextField from '@mui/material/TextField';

type TInput = {
  value: string;
  error: boolean;
  message: string;
  fulfilled: boolean;
};

const initialInput: TInput = {
  value: '',
  error: false,
  message: ' ',
  fulfilled: false,
};

const errorMessage = {
  email: 'メールアドレスを入力してください',
};

export default function TestInput_v2() {
  const [name, setName] = useState<TInput>(initialInput);
  const [email, setEmail] = useState<TInput>(initialInput);
  const [password, setPassword] = useState<TInput>(initialInput);
  const [cfmPassword, setCfmPassword] = useState<TInput>(initialInput);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const isInvalid = (): boolean => {
    return !(
      //   !name.error &&
      //   name.fulfilled &&
      //   !email.error &&
      //   email.fulfilled &&
      (!password.error && password.fulfilled && !cfmPassword.error && cfmPassword.fulfilled)
    );
  };

  return (
    <>
      <h1>Test</h1>
      <div>
        <p className="m-2">入力</p>
        <CTextField
          dataLabel={'名前'}
          dataName={'name'}
          dataType={'text'}
          data={name}
          setData={setName}
          dataProps={{ required: true }}
          dataRef={nameRef}
        />
        <CTextField
          dataLabel={'メールアドレス'}
          dataName={'email'}
          dataType={'email'}
          data={email}
          setData={setEmail}
          dataProps={{ required: true }}
          dataRef={emailRef}
          errorMessage={errorMessage.email}
        />
        <CPasswordField
          password={password}
          cfmPassword={cfmPassword}
          setPassword={setPassword}
          setCfmPassword={setCfmPassword}
        />
      </div>

      <div>
        <button
          type="button"
          className="btn btn-primary m-4"
          onClick={() => alert('クリックされました')}
          disabled={isInvalid()}
        >
          クリック
        </button>
      </div>
    </>
  );
}

// -------------------- TextField --------------------
function CTextField({
  dataLabel,
  dataName,
  dataType,
  data,
  setData,
  dataProps,
  dataRef,
  errorMessage = '不正な値です',
}: {
  dataLabel: string;
  dataName: string;
  dataType: string;
  data: TInput;
  setData: Dispatch<SetStateAction<TInput>>;
  dataProps: {};
  dataRef: RefObject<HTMLInputElement>;
  errorMessage?: string;
}) {
  const checkInput = (value: string, ref: HTMLInputElement) => {
    if (!ref.validity.valid) {
      if (!value) {
        setData({ ...data, value, error: true, message: '必須項目です' });
      } else {
        setData({ ...data, value, error: true, message: errorMessage });
      }
    } else {
      setData({ ...data, value, error: false, message: ' ', fulfilled: true });
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    dataRef: RefObject<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const ref = dataRef.current;
    if (ref) {
      if (ref.validity.valid || data.fulfilled) {
        checkInput(value, ref);
      } else {
        setData({ ...data, value });
      }
    } else {
    }
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    dataRef: RefObject<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const ref = dataRef.current;
    if (ref) {
      checkInput(value, ref);
    } else {
    }
  };

  return (
    <TextField
      className="m-2"
      style={{ width: '80%' }}
      label={dataLabel}
      name={dataName}
      type={dataType}
      inputProps={dataProps}
      inputRef={dataRef}
      error={data.error}
      color={!data.error && data.fulfilled ? 'success' : undefined}
      focused={!data.error && data.fulfilled}
      value={data.value}
      onChange={(event) => handleChange(event, dataRef)}
      onBlur={(event) => handleBlur(event, dataRef)}
      helperText={data.message}
    />
  );
}

// -------------------- Password --------------------
function CPasswordField({
  password,
  cfmPassword,
  setPassword,
  setCfmPassword,
}: {
  password: TInput;
  cfmPassword: TInput;
  setPassword: Dispatch<SetStateAction<TInput>>;
  setCfmPassword: Dispatch<SetStateAction<TInput>>;
}) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const cfmPasswordRef = useRef<HTMLInputElement>(null);

  const errorPasswordMessage: string =
    '半角英字と半角数字をそれぞれ1文字以上含む半角英数字6文字以上12文字以下で入力してください';
  const errorCfmPasswordMessage: string = 'パスワードが一致しません';

  const passwordPattern = '^[a-zA-Z0-9]{6,24}';

  const checkPassword = (
    value: string,
    ref: HTMLInputElement,
    password: TInput,
    setPassword: Dispatch<SetStateAction<TInput>>,
    errorMessage: string
  ) => {
    if (!ref.validity.valid) {
      if (!value) {
        setPassword({ ...password, value, error: true, message: '必須項目です' });
      } else {
        setPassword({
          ...password,
          value,
          error: true,
          message: errorMessage,
        });
      }
    } else {
      setPassword({ ...password, value, error: false, message: ' ', fulfilled: true });
    }
  };

  const handleChangePassword = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    passwordRef: RefObject<HTMLInputElement>,
    password: TInput,
    setPassword: Dispatch<SetStateAction<TInput>>,
    errorMessage: string
  ) => {
    const value = event.target.value;
    const ref = passwordRef.current;
    if (ref && cfmPasswordRef.current) {
      if (ref.validity.valid || password.fulfilled) {
        checkPassword(value, ref, password, setPassword, errorMessage);
      } else {
        setPassword({ ...password, value });
      }
      if ((cfmPassword.fulfilled || cfmPassword.message !== ' ') && ref.name === 'password') {
        const customRef: HTMLInputElement = {
          validity: {
            valid: value === cfmPassword.value,
          },
        } as HTMLInputElement;
        checkPassword(cfmPassword.value, customRef, cfmPassword, setCfmPassword, errorCfmPasswordMessage);
      } else {
      }
    } else {
    }
  };

  const handleBlurPassword = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    passwordRef: RefObject<HTMLInputElement>,
    password: TInput,
    setPassword: Dispatch<SetStateAction<TInput>>,
    errorMessage: string
  ) => {
    const value = event.target.value;
    const ref = passwordRef.current;
    if (ref) {
      checkPassword(value, ref, password, setPassword, errorMessage);
    } else {
    }
  };

  return (
    <>
      <TextField
        className="m-2"
        style={{ width: '80%' }}
        type="password"
        inputProps={{ required: true, pattern: passwordPattern }}
        inputRef={passwordRef}
        error={password.error}
        label="パスワード"
        name="password"
        color={!password.error && password.fulfilled ? 'success' : undefined}
        focused={!password.error && password.fulfilled}
        value={password.value}
        onChange={(event) => handleChangePassword(event, passwordRef, password, setPassword, errorPasswordMessage)}
        onBlur={(event) => handleBlurPassword(event, passwordRef, password, setPassword, errorPasswordMessage)}
        helperText={password.message}
      />
      <TextField
        className="m-2"
        style={{ width: '80%' }}
        type="password"
        inputProps={{ required: true, pattern: `^${password.value}$` }}
        inputRef={cfmPasswordRef}
        error={cfmPassword.error}
        label="確認用パスワード"
        name="cfmPassword"
        color={!cfmPassword.error && cfmPassword.fulfilled ? 'success' : undefined}
        focused={!cfmPassword.error && cfmPassword.fulfilled}
        value={cfmPassword.value}
        onChange={(event) => {
          handleChangePassword(event, cfmPasswordRef, cfmPassword, setCfmPassword, errorCfmPasswordMessage);
        }}
        onBlur={(event) =>
          handleBlurPassword(event, cfmPasswordRef, cfmPassword, setCfmPassword, errorCfmPasswordMessage)
        }
        helperText={cfmPassword.message}
      />
    </>
  );
}

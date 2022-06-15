import { useState, useRef, ChangeEvent, FocusEvent, Dispatch, SetStateAction, RefObject } from 'react';
import TextField from '@mui/material/TextField';

type TInput = {
  value: string;
  error: boolean;
  message: string;
  // fulfilledにしてみた（参考：https://www.eigochigai.com/2021/08/fill-fulfill.html?m=1）
  fulfilled: boolean;
};

const initialInput: TInput = {
  value: '',
  error: false,
  // messageに空白を入れることで加藤さんのおっしゃていた、エラーメッセージが出ることによるエレメントのズレを防止
  message: ' ',
  fulfilled: false,
};

export default function Test() {
  const [name, setName] = useState<TInput>(initialInput);
  const [email, setEmail] = useState<TInput>(initialInput);

  // useRefの使い方：https://qiita.com/seira/items/0e6a2d835f1afb50544d
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // 下記、useRefでバリデーションチェックしていますが、これまでの方法でも大丈夫です。
  // 下記のやり方で名前とメールのチェックを同じ関数にまとめられた
  const checkInput = (
    value: string,
    data: TInput,
    setData: Dispatch<SetStateAction<TInput>>,
    ref: HTMLInputElement
  ) => {
    // inputPropsで設定した条件に合わない場合（不正な場合）
    if (!ref.validity.valid) {
      // データがnullの場合
      if (!value) {
        setData({ ...data, value, error: true, message: '必須項目です' });
        // データが不正な場合
      } else {
        setData({ ...data, value, error: true, message: '不正な値です' });
      }
      // inputPropsで設定した条件に合う場合（正な場合）
    } else {
      // messageに空白を入れることで加藤さんのおっしゃていた、エラーメッセージが出ることによるエレメントのズレを防止
      setData({ ...data, value, error: false, message: ' ', fulfilled: true });
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    data: TInput,
    setData: Dispatch<SetStateAction<TInput>>,
    dataRef: RefObject<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const ref = dataRef.current;
    // refがnullかどうかチェック（必須）
    if (ref) {
      // 正な場合　もしくは　入力済み　の場合（＝一旦、正な入力ができた場合）
      if (ref.validity.valid || data.fulfilled) {
        // console.log(ref.validity.valid);
        // console.log(ref.validationMessage);

        checkInput(value, data, setData, ref);

        // まだ正な入力ができていない場合
      } else {
        setData({ ...data, value });
      }
      // refがnullの場合
    } else {
      // 原則起きないが、起きた場合を考慮して、今後エラーハンドリングが必要かも
    }
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    data: TInput,
    setData: Dispatch<SetStateAction<TInput>>,
    dataRef: RefObject<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const ref = dataRef.current;
    // refがnullかどうかチェック（必須）
    if (ref) {
      checkInput(value, data, setData, ref);
      // refがnullの場合
    } else {
      // 原則起きないが、起きた場合を考慮して、今後エラーハンドリングが必要かも
    }
  };

  const isInvalid = (): boolean => {
    return !(!name.error && name.fulfilled && !email.error && email.fulfilled);
  };

  return (
    <>
      <h1>Test</h1>
      <div>
        <p className="m-2">入力</p>
        <TextField
          className="m-2"
          style={{ width: '80%' }}
          // maxLengthとpatternはテスト用です
          inputProps={{ required: true, maxLength: 10, pattern: '^[a-zA-Z0-9_]+$' }}
          inputRef={nameRef}
          error={name.error}
          label="名前"
          name="name"
          // エラーではない　かつ　入力済み　の場合、緑色＋フォーカス
          color={!name.error && name.fulfilled ? 'success' : undefined}
          focused={!name.error && name.fulfilled}
          value={name.value}
          onChange={(event) => handleChange(event, name, setName, nameRef)}
          onBlur={(event) => handleBlur(event, name, setName, nameRef)}
          helperText={name.message}
          // チェックマークはなくてもいいかなと思いました（POに要相談）
        />
        <TextField
          className="m-2"
          style={{ width: '80%' }}
          // メールのチェックは「type="email"」でやってみた
          type="email"
          inputProps={{ required: true }}
          inputRef={emailRef}
          error={email.error}
          label="メール"
          name="email"
          // エラーではない　かつ　入力済み　の場合、緑色＋フォーカス
          color={!email.error && email.fulfilled ? 'success' : undefined}
          focused={!email.error && email.fulfilled}
          value={email.value}
          onChange={(event) => handleChange(event, email, setEmail, emailRef)}
          onBlur={(event) => handleBlur(event, email, setEmail, emailRef)}
          helperText={email.message}
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

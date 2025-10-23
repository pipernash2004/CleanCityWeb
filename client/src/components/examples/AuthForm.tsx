import AuthForm from "../AuthForm";

export default function AuthFormExample() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <AuthForm mode="login" />
      <AuthForm mode="register" />
    </div>
  );
}

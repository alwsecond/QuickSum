import Link from "next/link";
import Container from "./components/ui/container";
import NumbersWindow from "./components/shared/MathGameWindow";
import MathGameWindow from "./components/shared/MathGameWindow";

export default function Home() {
  return (
    <>
      <Container>
        <MathGameWindow/>
      </Container>
    </>
  );
}
public class Hacker extends Enemy {

    public Hacker() {

        super(
                "Rogue Hacker",
                80,
                20
        );
    }

    @Override
    public void specialAbility() {

        System.out.println(
                "💻 Hacker launches a cyber attack!"
        );
    }
}
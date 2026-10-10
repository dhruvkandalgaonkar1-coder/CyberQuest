public class Virus extends Enemy {

    public Virus() {

        super(
                "Virus",
                60,
                15
        );
    }

    @Override
    public void specialAbility() {

        System.out.println(
                "☠️ Virus spreads infection!"
        );
    }
}
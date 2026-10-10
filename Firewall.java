public class Firewall extends Enemy {

    public Firewall() {

        super(
                "Firewall",
                100,
                10
        );
    }

    @Override
    public void specialAbility() {

        System.out.println(
                "🔥 Firewall activates defense mode!"
        );
    }
}
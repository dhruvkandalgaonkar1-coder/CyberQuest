public class Item {

    private String name;
    private String description;
    private int healing;

    public Item(
            String name,
            String description,
            int healing) {

        this.name = name;
        this.description = description;
        this.healing = healing;
    }

    public void use(Player player) {

        player.heal(healing);

        System.out.println(
                "💊 Used " + name
        );

        System.out.println(
                "❤️ Restored " + healing + " HP"
        );
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {

        return name + " - " + description;
    }
}
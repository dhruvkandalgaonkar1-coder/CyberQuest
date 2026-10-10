public abstract class Enemy {

    protected String name;
    protected int health;
    protected int attackPower;

    public Enemy(String name, int health, int attackPower) {

        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
    }

    public abstract void specialAbility();

    public void attack(Player player) {

        player.takeDamage(attackPower);

        System.out.println(
                name + " attacked you for "
                        + attackPower + " damage!"
        );
    }

    public void takeDamage(int damage) {

        health -= damage;

        if (health < 0) {
            health = 0;
        }
    }

    public boolean isAlive() {
        return health > 0;
    }

    public String getName() {
        return name;
    }

    public int getHealth() {
        return health;
    }

    public int getAttackPower() {
        return attackPower;
    }
}
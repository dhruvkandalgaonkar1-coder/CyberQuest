import java.util.ArrayList;
import java.util.HashSet;
import java.util.HashMap;

public class Player {

    private String name;
    private int health;
    private int maxHealth;
    private int energy;
    private int xp;
    private int coins;
    private int level;

    private ArrayList<String> inventory;
    private HashSet<String> completedMissions;
    private HashMap<String, Integer> statistics;

    public Player(String name) {

        this.name = name;
        this.maxHealth = 100;
        this.health = 100;
        this.energy = 100;
        this.xp = 0;
        this.coins = 50;
        this.level = 1;

        inventory = new ArrayList<>();
        completedMissions = new HashSet<>();
        statistics = new HashMap<>();

        statistics.put("Battles Won", 0);
        statistics.put("Battles Lost", 0);
        statistics.put("Missions Completed", 0);
    }

    public String getName() {
        return name;
    }

    public int getHealth() {
        return health;
    }

    public int getEnergy() {
        return energy;
    }

    public int getXp() {
        return xp;
    }

    public int getCoins() {
        return coins;
    }

    public int getLevel() {
        return level;
    }

    public ArrayList<String> getInventory() {
        return inventory;
    }

    public void takeDamage(int damage) {

        health -= damage;

        if (health < 0) {
            health = 0;
        }
    }

    public void heal(int amount) {

        health += amount;

        if (health > maxHealth) {
            health = maxHealth;
        }
    }

    public void addXP(int amount) {

        xp += amount;

        if (xp >= level * 100) {

            xp -= level * 100;
            level++;

            maxHealth += 20;
            health = maxHealth;

            System.out.println("\n🎉 LEVEL UP!");
            System.out.println("You are now Level " + level);
        }
    }

    public void addCoins(int amount) {
        coins += amount;
    }

    public void addItem(String item) {
        inventory.add(item);
    }

    public void addStatistic(String stat) {

        statistics.put(
                stat,
                statistics.getOrDefault(stat, 0) + 1
        );
    }

    public void completeMission(String mission) {

        completedMissions.add(mission);

        addStatistic("Missions Completed");
    }
    public void showStats() {

        System.out.println("\n========== PLAYER STATS ==========");

        System.out.println("Name       : " + name);
        System.out.println("Level      : " + level);
        System.out.println("Health     : " + health + "/" + maxHealth);
        System.out.println("Energy     : " + energy);
        System.out.println("XP         : " + xp);
        System.out.println("Coins      : " + coins);

        System.out.println("\nInventory  : " + inventory);

        System.out.println("\nStatistics :");

        statistics.forEach(
                (key, value) ->
                        System.out.println(key + " : " + value)
        );
    }
}
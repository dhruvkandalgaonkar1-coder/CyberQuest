import java.util.Random;
import java.util.Scanner;

public class Battle {

    public static void start(Player player, Enemy enemy) {

        Scanner scanner = new Scanner(System.in);
        Random random = new Random();

        boolean defending = false;

        System.out.println("\n=================================");
        System.out.println("         ⚔️ BATTLE START");
        System.out.println("=================================");

        System.out.println(
                "Enemy: " + enemy.getName()
        );

        enemy.specialAbility();

        while (player.getHealth() > 0 && enemy.isAlive()) {

            System.out.println("\n---------------------------------");

            System.out.println(
                    "Your HP   : " + player.getHealth()
            );

            System.out.println(
                    "Enemy HP  : " + enemy.getHealth()
            );

            System.out.println("\nChoose action:");

            System.out.println("1. ⚔️ Attack");
            System.out.println("2. 🔍 Scan");
            System.out.println("3. 🛡️ Defend");
            System.out.println("4. 🏃 Escape");

            System.out.print("\nChoice: ");

            int choice;

            try {

                choice = scanner.nextInt();

            } catch (Exception e) {

                System.out.println(
                        "❌ Invalid input!"
                );

                scanner.nextLine();
                continue;
            }

            switch (choice) {

                case 1:

                    int damage = 25;

                    // Random critical hit
                    if (random.nextInt(5) == 0) {

                        damage += 15;

                        System.out.println(
                                "💥 CRITICAL HIT!"
                        );
                    }

                    enemy.takeDamage(damage);

                    System.out.println(
                            "⚔️ You dealt "
                                    + damage
                                    + " damage!"
                    );

                    break;

                case 2:

                    System.out.println(
                            "\n🔍 SCAN RESULTS"
                    );

                    System.out.println(
                            "Enemy: "
                                    + enemy.getName()
                    );

                    System.out.println(
                            "HP: "
                                    + enemy.getHealth()
                    );

                    System.out.println(
                            "Attack Power: "
                                    + enemy.getAttackPower()
                    );

                    break;

                case 3:

                    defending = true;

                    System.out.println(
                            "🛡️ Defensive mode activated!"
                    );

                    break;

                case 4:

                    System.out.println(
                            "🏃 You escaped!"
                    );

                    return;

                default:

                    System.out.println(
                            "❌ Invalid choice!"
                    );

                    continue;
            }

            if (enemy.isAlive()) {

                int enemyDamage =
                        enemy.getAttackPower();

                if (defending) {

                    enemyDamage /= 2;

                    defending = false;

                    System.out.println(
                            "🛡️ Defense reduced damage!"
                    );
                }

                player.takeDamage(enemyDamage);

                System.out.println(
                        "💀 "
                                + enemy.getName()
                                + " dealt "
                                + enemyDamage
                                + " damage!"
                );
            }
        }

        if (player.getHealth() > 0) {

            System.out.println(
                    "\n🏆 VICTORY!"
            );

            player.addXP(50);
            player.addCoins(25);

            player.addStatistic(
                    "Battles Won"
            );

            System.out.println("+50 XP");
            System.out.println("+25 Coins");

        } else {

            System.out.println(
                    "\n💀 DEFEAT!"
            );

            player.addStatistic(
                    "Battles Lost"
            );
        }
    scanner.close();
    }
}
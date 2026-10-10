import java.util.Scanner;

public class Main {

    static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {

        System.out.println(
                "========================================"
        );

        System.out.println(
                "           🎮 CYBERQUEST 🎮"
        );

        System.out.println(
                "      DIGITAL SURVIVAL SIMULATOR"
        );

        System.out.println(
                "========================================"
        );

        System.out.print(
                "\nEnter your hacker name: "
        );

        String name = scanner.nextLine();

        Player player = new Player(name);

        player.addItem("Health Patch");

        gameLoop(player);
    }

    public static void gameLoop(Player player) {

        while (true) {

            System.out.println(
                    "\n========== MAIN MENU =========="
            );

            System.out.println(
                    "1. 🎯 Start Mission"
            );

            System.out.println(
                    "2. 📊 Player Stats"
            );

            System.out.println(
                    "3. 🎒 Inventory"
            );

            System.out.println(
                    "4. 💾 Save Game"
            );

            System.out.println(
                    "5. ❌ Exit"
            );

            System.out.print(
                    "\nChoose: "
            );

            try {

                int choice = Integer.parseInt(
                        scanner.nextLine()
                );

                switch (choice) {

                    case 1:

                        startMission(player);

                        break;

                    case 2:

                        player.showStats();

                        break;

                    case 3:

                        showInventory(player);

                        break;

                    case 4:

                        SaveManager.save(player);

                        break;

                    case 5:

                        System.out.println(
                                "\nThanks for playing CyberQuest! 🎮"
                        );

                        scanner.close();

                        return;

                    default:

                        System.out.println(
                                "❌ Invalid choice!"
                        );
                }

            } catch (NumberFormatException e) {

                System.out.println(
                        "❌ Please enter a number."
                );
            }
        }
    }

    public static void startMission(Player player) {

        System.out.println(
                "\n========== MISSIONS =========="
        );

        System.out.println(
                "1. 🦠 Virus Outbreak"
        );

        System.out.println(
                "2. 💻 Rogue Hacker"
        );

        System.out.println(
                "3. 🔥 Firewall Fortress"
        );

        System.out.print(
                "\nChoose mission: "
        );

        int choice;

        try {

            choice = Integer.parseInt(
                    scanner.nextLine()
            );

        } catch (NumberFormatException e) {

            System.out.println(
                    "❌ Please enter a number."
            );

            return;
        }

        Enemy enemy;

        String missionName;

        switch (choice) {

            case 1:

                enemy = new Virus();

                missionName =
                        "Virus Outbreak";

                break;

            case 2:

                enemy = new Hacker();

                missionName =
                        "Rogue Hacker";

                break;

            case 3:

                enemy = new Firewall();

                missionName =
                        "Firewall Fortress";

                break;

            default:

                System.out.println(
                        "❌ Invalid mission!"
                );

                return;
        }

        Mission mission =
                new Mission(
                        missionName,
                        "Complete this cyber mission!",
                        50,
                        25
                );

        mission.showMission();

        System.out.println(
                "\nStarting mission..."
        );

        Battle.start(player, enemy);

        if (
                player.getHealth() > 0
                && enemy.getHealth() <= 0
        ) {

            player.completeMission(
                    mission.getName()
            );

            player.addXP(
                    mission.getRewardXP()
            );

            player.addCoins(
                    mission.getRewardCoins()
            );

            player.addItem(
                    "Mission Reward"
            );

            System.out.println(
                    "\n🎁 Mission completed!"
            );

            System.out.println(
                    "+"
                            + mission.getRewardXP()
                            + " XP"
            );

            System.out.println(
                    "+"
                            + mission.getRewardCoins()
                            + " Coins"
            );
        }
    }

    public static void showInventory(
            Player player) {

        System.out.println(
                "\n========== INVENTORY =========="
        );

        if (player.getInventory().isEmpty()) {

            System.out.println(
                    "Inventory is empty."
            );

        } else {

            for (
                    String item :
                    player.getInventory()
            ) {

                System.out.println(
                        "• " + item
                );
            }
        }
    }
}